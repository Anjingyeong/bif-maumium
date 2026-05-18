import { Prisma, PrismaClient } from "@prisma/client";
import type { Express, Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ResultPayload = {
  nickname?: unknown;
  testType?: unknown;
  answers?: unknown;
  categoryScores?: unknown;
  totalScore?: unknown;
  maxScore?: unknown;
  riskLevel?: unknown;
  riskTitle?: unknown;
  consentGiven?: unknown;
};

function sendError(res: Response, status: number, message: string) {
  return res.status(status).json({ error: message });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function normalizeNickname(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const nickname = value.trim();
  if (nickname.length < 1 || nickname.length > 40) return null;
  if (/[<>]/.test(nickname)) return null;
  return nickname;
}

function validateResultPayload(body: ResultPayload) {
  const nickname = normalizeNickname(body.nickname);
  if (!nickname) {
    return { error: "닉네임은 1~40자 사이로 입력해 주세요." } as const;
  }

  if (body.testType !== "adult" && body.testType !== "child") {
    return { error: "testType은 adult 또는 child여야 합니다." } as const;
  }

  if (body.consentGiven !== true) {
    return { error: "결과 저장 동의가 있어야 저장할 수 있습니다." } as const;
  }

  if (!isPlainObject(body.answers)) {
    return { error: "answers는 객체여야 합니다." } as const;
  }

  if (!isPlainObject(body.categoryScores)) {
    return { error: "categoryScores는 객체여야 합니다." } as const;
  }

  if (
    typeof body.totalScore !== "number" ||
    !Number.isInteger(body.totalScore) ||
    body.totalScore < 0
  ) {
    return { error: "totalScore는 0 이상의 정수여야 합니다." } as const;
  }

  if (
    typeof body.maxScore !== "number" ||
    !Number.isInteger(body.maxScore) ||
    body.maxScore <= 0
  ) {
    return { error: "maxScore는 양의 정수여야 합니다." } as const;
  }

  if (
    typeof body.riskLevel !== "string" ||
    body.riskLevel.length < 1 ||
    body.riskLevel.length > 32
  ) {
    return { error: "riskLevel이 올바르지 않습니다." } as const;
  }

  if (
    typeof body.riskTitle !== "string" ||
    body.riskTitle.length < 1 ||
    body.riskTitle.length > 160
  ) {
    return { error: "riskTitle이 올바르지 않습니다." } as const;
  }

  return {
    data: {
      nickname,
      testType: body.testType,
      answers: body.answers as Prisma.InputJsonValue,
      categoryScores: body.categoryScores as Prisma.InputJsonValue,
      totalScore: body.totalScore,
      maxScore: body.maxScore,
      riskLevel: body.riskLevel,
      riskTitle: body.riskTitle,
      consentGiven: true,
    },
  } as const;
}

function requireAdminToken(req: Request, res: Response, next: NextFunction) {
  const configuredToken = process.env.ADMIN_TOKEN;
  if (!configuredToken) {
    return sendError(res, 503, "관리자 토큰이 설정되지 않았습니다.");
  }

  const match = (req.header("authorization") || "").match(/^Bearer\s+(.+)$/i);
  const token = match?.[1];

  if (token !== configuredToken) {
    return sendError(res, 401, "관리자 권한이 필요합니다.");
  }

  return next();
}

export function registerResultsApi(app: Express) {
  app.post("/api/results", async (req, res) => {
    const validated = validateResultPayload(req.body);
    if ("error" in validated) {
      return sendError(res, 400, validated.error || "요청 값이 올바르지 않습니다.");
    }

    try {
      const result = await prisma.screeningResult.create({
        data: validated.data,
        select: {
          id: true,
          nickname: true,
          testType: true,
          totalScore: true,
          maxScore: true,
          riskLevel: true,
          riskTitle: true,
          submittedAt: true,
        },
      });

      return res.status(201).json(result);
    } catch (error) {
      console.error("Failed to save screening result", error);
      return sendError(res, 500, "결과 저장 중 오류가 발생했습니다.");
    }
  });

  app.get("/api/results/:id", async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return sendError(res, 400, "결과 ID가 필요합니다.");
    }
    if (!UUID_RE.test(id)) {
      return sendError(res, 400, "결과 ID 형식이 올바르지 않습니다.");
    }

    const result = await prisma.screeningResult.findUnique({
      where: { id },
      select: {
        id: true,
        nickname: true,
        testType: true,
        totalScore: true,
        maxScore: true,
        riskLevel: true,
        riskTitle: true,
        consentGiven: true,
        submittedAt: true,
      },
    });

    if (!result) {
      return sendError(res, 404, "결과를 찾을 수 없습니다.");
    }

    return res.json(result);
  });

  app.get("/api/admin/results", requireAdminToken, async (req, res) => {
    const limitRaw = Number(req.query.limit ?? 50);
    const limit = Number.isInteger(limitRaw)
      ? Math.min(Math.max(limitRaw, 1), 100)
      : 50;

    const results = await prisma.screeningResult.findMany({
      orderBy: { submittedAt: "desc" },
      take: limit,
      select: {
        id: true,
        nickname: true,
        testType: true,
        totalScore: true,
        maxScore: true,
        riskLevel: true,
        riskTitle: true,
        consentGiven: true,
        submittedAt: true,
      },
    });

    return res.json({ results });
  });

  app.delete("/api/admin/results/:id", requireAdminToken, async (req, res) => {
    const id = req.params.id;
    if (!id) {
      return sendError(res, 400, "결과 ID가 필요합니다.");
    }
    if (!UUID_RE.test(id)) {
      return sendError(res, 400, "결과 ID 형식이 올바르지 않습니다.");
    }

    try {
      await prisma.screeningResult.delete({ where: { id } });
      return res.status(204).end();
    } catch (error) {
      return sendError(res, 404, "삭제할 결과를 찾을 수 없습니다.");
    }
  });
}
