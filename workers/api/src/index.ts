type TestType = "adult" | "child";

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  meta?: unknown;
  error?: string;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(column?: string): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
  FRONTEND_ORIGIN?: string;
}

interface ResultPayload {
  nickname?: unknown;
  testType?: unknown;
  answers?: unknown;
  domainScores?: unknown;
  categoryScores?: unknown;
  totalScore?: unknown;
  maxScore?: unknown;
  riskLevel?: unknown;
  riskTitle?: unknown;
  consentAgreed?: unknown;
  consentGiven?: unknown;
  createdAt?: unknown;
}

interface ValidatedPayload {
  nickname: string;
  testType: TestType;
  answersJson: string;
  domainScoresJson: string;
  totalScore: number;
  maxScore: number;
  riskLevel: string;
  riskTitle: string;
  createdAt: string;
}

interface ScreeningResultRow {
  id: string;
  nickname: string;
  test_type: TestType;
  answers_json: string;
  domain_scores_json: string;
  total_score: number;
  max_score: number;
  risk_level: string;
  risk_title: string;
  consent_agreed: number;
  created_at: string;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const SECURITY_HEADERS: HeadersInit = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-Frame-Options": "DENY",
  "Content-Security-Policy": "frame-ancestors 'none'",
};

function jsonResponse(
  body: unknown,
  init: ResponseInit = {},
  corsHeaders: HeadersInit = {}
) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...SECURITY_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders,
      ...init.headers,
    },
  });
}

function errorResponse(
  message: string,
  status: number,
  corsHeaders: HeadersInit
) {
  return jsonResponse({ error: message }, { status }, corsHeaders);
}

function getAllowedOrigins(env: Env): string[] {
  return (env.FRONTEND_ORIGIN || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);
}

function buildCorsHeaders(request: Request, env: Env): HeadersInit {
  const origin = request.headers.get("Origin");
  const allowedOrigins = getAllowedOrigins(env);

  if (!origin) return {};
  if (allowedOrigins.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      Vary: "Origin",
    };
  }

  return {};
}

function isCorsAllowed(request: Request, env: Env): boolean {
  const origin = request.headers.get("Origin");
  return !origin || getAllowedOrigins(env).includes(origin);
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

function normalizeCreatedAt(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function validatePayload(
  body: ResultPayload
): { data: ValidatedPayload } | { error: string } {
  const nickname = normalizeNickname(body.nickname);
  if (!nickname) return { error: "nickname must be 1-40 characters." };

  if (body.testType !== "adult" && body.testType !== "child") {
    return { error: "testType must be adult or child." };
  }

  if (body.consentAgreed !== true && body.consentGiven !== true) {
    return { error: "consentAgreed must be true to save a result." };
  }

  if (!isPlainObject(body.answers)) {
    return { error: "answers must be an object." };
  }

  const domainScores = body.domainScores ?? body.categoryScores;
  if (!isPlainObject(domainScores)) {
    return { error: "domainScores must be an object." };
  }

  if (
    typeof body.totalScore !== "number" ||
    !Number.isInteger(body.totalScore) ||
    body.totalScore < 0
  ) {
    return { error: "totalScore must be a non-negative integer." };
  }

  if (
    typeof body.maxScore !== "number" ||
    !Number.isInteger(body.maxScore) ||
    body.maxScore <= 0
  ) {
    return { error: "maxScore must be a positive integer." };
  }

  if (
    typeof body.riskLevel !== "string" ||
    body.riskLevel.length < 1 ||
    body.riskLevel.length > 32
  ) {
    return { error: "riskLevel is invalid." };
  }

  if (
    typeof body.riskTitle !== "string" ||
    body.riskTitle.length < 1 ||
    body.riskTitle.length > 160
  ) {
    return { error: "riskTitle is invalid." };
  }

  const createdAt = normalizeCreatedAt(body.createdAt);
  if (!createdAt) {
    return { error: "createdAt must be a valid ISO date string." };
  }

  return {
    data: {
      nickname,
      testType: body.testType,
      answersJson: JSON.stringify(body.answers),
      domainScoresJson: JSON.stringify(domainScores),
      totalScore: body.totalScore,
      maxScore: body.maxScore,
      riskLevel: body.riskLevel,
      riskTitle: body.riskTitle,
      createdAt,
    },
  };
}

function requireAdmin(request: Request, env: Env): boolean {
  const authorization = request.headers.get("Authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return !!env.ADMIN_TOKEN && !!match && match[1] === env.ADMIN_TOKEN;
}

function safeParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
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

function formatKst(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour12: false,
  });
}

function toResultSummary(row: ScreeningResultRow) {
  return {
    id: row.id,
    nickname: row.nickname,
    testType: row.test_type,
    totalScore: row.total_score,
    maxScore: row.max_score,
    riskLevel: row.risk_level,
    riskTitle: row.risk_title,
    consentAgreed: row.consent_agreed === 1,
    createdAt: row.created_at,
  };
}

function toAdminResult(row: ScreeningResultRow) {
  const answers = safeParseJson(row.answers_json);
  const domainScores = safeParseJson(row.domain_scores_json);
  const answerCount = isPlainObject(answers) ? Object.keys(answers).length : 0;
  const domains = isPlainObject(domainScores)
    ? Object.entries(domainScores).map(([name, value]) => {
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
    ...toResultSummary(row),
    domainScores,
    adminView: {
      scoreText: `${row.total_score}/${row.max_score}`,
      scorePercent: formatPercent(row.total_score, row.max_score),
      answerCount,
      createdAtKst: formatKst(row.created_at),
      domains,
    },
  };
}

async function saveResult(request: Request, env: Env, corsHeaders: HeadersInit) {
  const body = (await request.json().catch(() => null)) as ResultPayload | null;
  if (!body) return errorResponse("Invalid JSON body.", 400, corsHeaders);

  const validated = validatePayload(body);
  if ("error" in validated) {
    return errorResponse(validated.error, 400, corsHeaders);
  }

  const id = crypto.randomUUID();
  const data = validated.data;

  await env.DB.prepare(
    `INSERT INTO screening_results (
      id, nickname, test_type, answers_json, domain_scores_json,
      total_score, max_score, risk_level, risk_title, consent_agreed, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`
  )
    .bind(
      id,
      data.nickname,
      data.testType,
      data.answersJson,
      data.domainScoresJson,
      data.totalScore,
      data.maxScore,
      data.riskLevel,
      data.riskTitle,
      data.createdAt
    )
    .run();

  return jsonResponse(
    {
      id,
      nickname: data.nickname,
      testType: data.testType,
      totalScore: data.totalScore,
      maxScore: data.maxScore,
      riskLevel: data.riskLevel,
      riskTitle: data.riskTitle,
      consentAgreed: true,
      createdAt: data.createdAt,
    },
    { status: 201 },
    corsHeaders
  );
}

async function getResult(id: string, env: Env, corsHeaders: HeadersInit) {
  if (!UUID_RE.test(id)) {
    return errorResponse("Invalid result id.", 400, corsHeaders);
  }

  const row = await env.DB.prepare(
    "SELECT * FROM screening_results WHERE id = ?"
  )
    .bind(id)
    .first<ScreeningResultRow>();

  if (!row) return errorResponse("Result not found.", 404, corsHeaders);
  return jsonResponse(toResultSummary(row), { status: 200 }, corsHeaders);
}

async function listAdminResults(
  request: Request,
  env: Env,
  corsHeaders: HeadersInit
) {
  if (!requireAdmin(request, env)) {
    return errorResponse("Unauthorized.", 401, corsHeaders);
  }

  const url = new URL(request.url);
  const limitRaw = Number(url.searchParams.get("limit") || 50);
  const limit = Number.isInteger(limitRaw)
    ? Math.min(Math.max(limitRaw, 1), 100)
    : 50;

  const { results = [] } = await env.DB.prepare(
    "SELECT * FROM screening_results ORDER BY created_at DESC LIMIT ?"
  )
    .bind(limit)
    .all<ScreeningResultRow>();

  return jsonResponse(
    { results: results.map(toAdminResult) },
    { status: 200 },
    corsHeaders
  );
}

async function deleteAdminResult(
  request: Request,
  env: Env,
  corsHeaders: HeadersInit,
  id: string
) {
  if (!requireAdmin(request, env)) {
    return errorResponse("Unauthorized.", 401, corsHeaders);
  }

  if (!UUID_RE.test(id)) {
    return errorResponse("Invalid result id.", 400, corsHeaders);
  }

  const existing = await env.DB.prepare(
    "SELECT id FROM screening_results WHERE id = ?"
  )
    .bind(id)
    .first<{ id: string }>();

  if (!existing) return errorResponse("Result not found.", 404, corsHeaders);

  await env.DB.prepare("DELETE FROM screening_results WHERE id = ?")
    .bind(id)
    .run();

  return new Response(null, {
    status: 204,
    headers: { ...SECURITY_HEADERS, ...corsHeaders },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = buildCorsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return isCorsAllowed(request, env)
        ? new Response(null, {
            status: 204,
            headers: { ...SECURITY_HEADERS, ...corsHeaders },
          })
        : new Response(null, { status: 403, headers: SECURITY_HEADERS });
    }

    if (!isCorsAllowed(request, env)) {
      return errorResponse("Origin is not allowed.", 403, corsHeaders);
    }

    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "POST" && pathname === "/api/results") {
      return saveResult(request, env, corsHeaders);
    }

    const resultMatch = pathname.match(/^\/api\/results\/([^/]+)$/);
    if (request.method === "GET" && resultMatch?.[1]) {
      return getResult(resultMatch[1], env, corsHeaders);
    }

    if (request.method === "GET" && pathname === "/api/admin/results") {
      return listAdminResults(request, env, corsHeaders);
    }

    const adminDeleteMatch = pathname.match(/^\/api\/admin\/results\/([^/]+)$/);
    if (request.method === "DELETE" && adminDeleteMatch?.[1]) {
      return deleteAdminResult(request, env, corsHeaders, adminDeleteMatch[1]);
    }

    return errorResponse("Not found.", 404, corsHeaders);
  },
};
