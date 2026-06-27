import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerOgMetaRoute } from "../ogMeta";
import { registerResultsApi } from "../resultsApi";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
    next();
  });
  app.use((req, res, next) => {
    const origin = req.header("origin");
    const configuredOrigins = (process.env.FRONTEND_ORIGIN || "https://maumium.pages.dev")
      .split(",")
      .map(value => value.trim())
      .filter(Boolean);
    const localDevOrigins =
      process.env.NODE_ENV === "production"
        ? []
        : ["http://localhost:3000", "http://localhost:5173"];
    const allowedOrigins = [...configuredOrigins, ...localDevOrigins];

    if (!origin || allowedOrigins.includes(origin)) {
      if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
      }
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
    }

    if (req.method === "OPTIONS") {
      return allowedOrigins.includes(origin || "")
        ? res.status(204).end()
        : res.status(403).end();
    }

    return next();
  });
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerResultsApi(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // 동적 OG 메타태그 라우트 - Vite/static 미들웨어보다 먼저 등록해야 함
  // 프로덕션: dist/public/index.html, 개발: client/index.html
  const indexHtmlPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(import.meta.dirname, "public", "index.html")
      : path.resolve(import.meta.dirname, "../..", "client", "index.html");
  registerOgMetaRoute(app, indexHtmlPath);

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    await setupVite(app, server);
  }

  const preferredPort = parseInt(process.env.PORT || "5173");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
