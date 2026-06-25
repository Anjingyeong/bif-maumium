import { Prisma, PrismaClient } from "@prisma/client";
import type { Express, Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ResultPayload = {
  nickname?: unknown;
  email?: unknown;
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

function validateEmail(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const email = value.trim();
  if (email.length > 255 || !/^.+@.+\..+$/.test(email)) return null;
  return email;
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
      email: validateEmail(body.email),
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

function isScoreEntry(value: unknown): value is { score: number; max: number } {
  return (
    isPlainObject(value) &&
    typeof value.score === "number" &&
    typeof value.max === "number" &&
    value.max > 0
  );
}

function formatPercent(score: number, max: number): number {
  return Math.round((score / max) * 100);
}

function formatKst(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour12: false,
  });
}

function toAdminResult(result: {
  id: string;
  nickname: string;
  email: string | null;
  testType: string;
  answers: Prisma.JsonValue;
  categoryScores: Prisma.JsonValue;
  totalScore: number;
  maxScore: number;
  riskLevel: string;
  riskTitle: string;
  consentGiven: boolean;
  submittedAt: Date;
}) {
  const answerCount = isPlainObject(result.answers)
    ? Object.keys(result.answers).length
    : 0;
  const domains = isPlainObject(result.categoryScores)
    ? Object.entries(result.categoryScores).map(([name, value]) => {
        if (!isScoreEntry(value)) {
          return { name, score: null, max: null, percent: null };
        }
        return {
          name,
          score: value.score,
          max: value.max,
          percent: formatPercent(value.score, value.max),
        };
      })
    : [];

  return {
    id: result.id,
    nickname: result.nickname,
    email: result.email,
    testType: result.testType,
    totalScore: result.totalScore,
    maxScore: result.maxScore,
    riskLevel: result.riskLevel,
    riskTitle: result.riskTitle,
    consentGiven: result.consentGiven,
    submittedAt: result.submittedAt,
    categoryScores: result.categoryScores,
    adminView: {
      scoreText: `${result.totalScore}/${result.maxScore}`,
      scorePercent: formatPercent(result.totalScore, result.maxScore),
      answerCount,
      submittedAtKst: formatKst(result.submittedAt),
      domains,
    },
  };
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
          email: true,
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
        email: true,
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

    // 로컬 환경에서 DATABASE_URL이 없을 경우 UI 테스트용 목업 데이터를 반환합니다.
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL found. Returning mock results for testing.");
      const mockResults = [
        toAdminResult({
          id: "11111111-1111-1111-1111-111111111111", nickname: "테스터(낮음)", email: "test1@example.com", testType: "adult",
          answers: {}, categoryScores: {}, totalScore: 5, maxScore: 36, riskLevel: "low", riskTitle: "낮음", consentGiven: true, submittedAt: new Date()
        }),
        toAdminResult({
          id: "22222222-2222-2222-2222-222222222222", nickname: "테스터(주의)", email: null, testType: "child",
          answers: {}, categoryScores: {}, totalScore: 15, maxScore: 36, riskLevel: "caution", riskTitle: "주의", consentGiven: true, submittedAt: new Date(Date.now() - 3600000)
        }),
        toAdminResult({
          id: "33333333-3333-3333-3333-333333333333", nickname: "테스터(상담)", email: "test3@test.com", testType: "adult",
          answers: {}, categoryScores: {}, totalScore: 25, maxScore: 36, riskLevel: "consult", riskTitle: "상담 권장", consentGiven: true, submittedAt: new Date(Date.now() - 7200000)
        }),
        toAdminResult({
          id: "44444444-4444-4444-4444-444444444444", nickname: "테스터(과거데이터)", email: null, testType: "adult",
          answers: {}, categoryScores: {}, totalScore: 20, maxScore: 36, riskLevel: "moderate", riskTitle: "전문가 상담 권장", consentGiven: true, submittedAt: new Date(Date.now() - 86400000)
        })
      ];
      return res.json({ results: mockResults });
    }

    const results = await prisma.screeningResult.findMany({
      orderBy: { submittedAt: "desc" },
      take: limit,
      select: {
        id: true,
        nickname: true,
        email: true,
        testType: true,
        answers: true,
        categoryScores: true,
        totalScore: true,
        maxScore: true,
        riskLevel: true,
        riskTitle: true,
        consentGiven: true,
        submittedAt: true,
      },
    });

    return res.json({ results: results.map(toAdminResult) });
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

  app.post("/api/subscriptions", async (req, res) => {
    const emailRaw = req.body?.email;
    if (typeof emailRaw !== "string" || !emailRaw.trim()) {
      return res.status(400).json({ ok: false, error: "invalid_email" });
    }
    const email = emailRaw.trim().toLowerCase();
    if (email.length > 255 || !/^.+@.+\..+$/.test(email)) {
      return res.status(400).json({ ok: false, error: "invalid_email" });
    }

    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL found. Mocking subscription success.");
      return res.status(201).json({ ok: true, status: "created" });
    }

    try {
      const existing = await prisma.subscription.findUnique({
        where: { email },
      });
      if (existing) {
        return res.status(200).json({ ok: true, status: "already_exists" });
      }

      await prisma.subscription.create({
        data: { email },
      });
      return res.status(201).json({ ok: true, status: "created" });
    } catch (error) {
      console.error("Failed to save subscription email:", error);
      return res.status(500).json({ ok: false, error: "server_error" });
    }
  });

  app.get("/api/admin/subscriptions", requireAdminToken, async (req, res) => {
    if (!process.env.DATABASE_URL) {
      console.warn("No DATABASE_URL found. Returning mock subscriptions for testing.");
      const mockSubs = [
        { email: "admin-test1@example.com", created_at: new Date().toISOString(), createdAt: new Date().toISOString() },
        { email: "user-test2@maumium.com", created_at: new Date(Date.now() - 3600000).toISOString(), createdAt: new Date(Date.now() - 3600000).toISOString() },
        { email: "hello-world3@gmail.com", created_at: new Date(Date.now() - 86400000).toISOString(), createdAt: new Date(Date.now() - 86400000).toISOString() }
      ];
      return res.json({ ok: true, subscriptions: mockSubs });
    }

    try {
      const subscriptions = await prisma.subscription.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          email: true,
          createdAt: true,
        },
      });

      const formatted = subscriptions.map(sub => ({
        email: sub.email,
        created_at: sub.createdAt.toISOString(),
        createdAt: sub.createdAt.toISOString()
      }));

      return res.json({ ok: true, subscriptions: formatted });
    } catch (error) {
      console.error("Failed to list subscriptions:", error);
      return sendError(res, 500, "구독 이메일 목록을 불러오는 중 오류가 발생했습니다.");
    }
  });
}


