import { describe, expect, it } from "vitest";
import worker from "../workers/api/src/index";

type Row = {
  id: string;
  nickname: string;
  email: string | null;
  test_type: "adult" | "child";
  answers_json: string;
  domain_scores_json: string;
  total_score: number;
  max_score: number;
  risk_level: string;
  risk_title: string;
  consent_agreed: number;
  created_at: string;
};

class MockStatement {
  private values: unknown[] = [];

  constructor(
    private readonly rows: Row[],
    private readonly query: string
  ) {}

  bind(...values: unknown[]) {
    this.values = values;
    return this;
  }

  async first<T = unknown>(): Promise<T | null> {
    const id = this.values[0];
    const row = this.rows.find(item => item.id === id);
    return (row as T | undefined) ?? null;
  }

  async all<T = unknown>() {
    const limit = Number(this.values[0] ?? 50);
    return {
      success: true,
      results: this.rows.slice(0, limit) as T[],
    };
  }

  async run() {
    if (this.query.startsWith("INSERT")) {
      const [
        id,
        nickname,
        email,
        testType,
        answersJson,
        domainScoresJson,
        totalScore,
        maxScore,
        riskLevel,
        riskTitle,
        createdAt,
      ] = this.values;

      this.rows.push({
        id: String(id),
        nickname: String(nickname),
        email: typeof email === "string" ? email : null,
        test_type: testType as "adult" | "child",
        answers_json: String(answersJson),
        domain_scores_json: String(domainScoresJson),
        total_score: Number(totalScore),
        max_score: Number(maxScore),
        risk_level: String(riskLevel),
        risk_title: String(riskTitle),
        consent_agreed: 1,
        created_at: String(createdAt),
      });
    }

    if (this.query.startsWith("DELETE")) {
      const id = this.values[0];
      const index = this.rows.findIndex(item => item.id === id);
      if (index >= 0) this.rows.splice(index, 1);
    }

    return { success: true };
  }
}

function createEnv() {
  const rows: Row[] = [];
  return {
    env: {
      ADMIN_TOKEN: "secret-admin-token",
      FRONTEND_ORIGIN: "https://example.com",
      DB: {
        prepare(query: string) {
          return new MockStatement(rows, query);
        },
      },
    },
    rows,
  };
}

function request(path: string, init: RequestInit = {}) {
  return new Request(`https://api.example.com${path}`, {
    ...init,
    headers: {
      Origin: "https://example.com",
      ...(init.headers || {}),
    },
  });
}

describe("Cloudflare Worker result API", () => {
  it("saves and fetches a consented screening result", async () => {
    const { env } = createEnv();
    const payload = {
      nickname: "tester",
      testType: "adult",
      answers: { 1: 2 },
      domainScores: { learning: { score: 2, max: 3 } },
      totalScore: 2,
      maxScore: 45,
      riskLevel: "low",
      riskTitle: "Low",
      consentAgreed: true,
      createdAt: "2026-05-18T00:00:00.000Z",
    };

    const saved = await worker.fetch(
      request("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
      env
    );

    expect(saved.status).toBe(201);
    const savedBody = await saved.json();
    expect(savedBody.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
    expect(savedBody.createdAt).toBe(payload.createdAt);

    const fetched = await worker.fetch(
      request(`/api/results/${savedBody.id}`),
      env
    );
    expect(fetched.status).toBe(200);
    const fetchedBody = await fetched.json();
    expect(fetchedBody).toMatchObject({
      nickname: "tester",
      consentAgreed: true,
      createdAt: payload.createdAt,
    });
    expect(fetchedBody.answers).toBeUndefined();
    expect(fetchedBody.domainScores).toBeUndefined();
  });

  it("does not save without consent", async () => {
    const { env, rows } = createEnv();
    const response = await worker.fetch(
      request("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: "tester",
          testType: "adult",
          answers: {},
          domainScores: {},
          totalScore: 0,
          maxScore: 45,
          riskLevel: "low",
          riskTitle: "Low",
          consentAgreed: false,
          createdAt: "2026-05-18T00:00:00.000Z",
        }),
      }),
      env
    );

    expect(response.status).toBe(400);
    expect(rows).toHaveLength(0);
  });

  it("protects admin results with ADMIN_TOKEN", async () => {
    const { env } = createEnv();
    const unauthorized = await worker.fetch(
      request("/api/admin/results"),
      env
    );
    expect(unauthorized.status).toBe(401);

    const authorized = await worker.fetch(
      request("/api/admin/results", {
        headers: { Authorization: "Bearer secret-admin-token" },
      }),
      env
    );
    expect(authorized.status).toBe(200);
  });

  it("returns admin-friendly result summaries without raw answers", async () => {
    const { env } = createEnv();
    const payload = {
      nickname: "tester",
      testType: "adult",
      answers: { 1: 2 },
      domainScores: { learning: { score: 2, max: 3 } },
      totalScore: 2,
      maxScore: 45,
      riskLevel: "low",
      riskTitle: "Low",
      consentAgreed: true,
      createdAt: "2026-05-18T00:00:00.000Z",
    };

    await worker.fetch(
      request("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
      env
    );

    const response = await worker.fetch(
      request("/api/admin/results", {
        headers: { Authorization: "Bearer secret-admin-token" },
      }),
      env
    );
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.results[0]).toMatchObject({
      nickname: "tester",
      domainScores: { learning: { score: 2, max: 3 } },
      adminView: {
        scoreText: "2/45",
        scorePercent: 4,
        answerCount: 1,
        domains: [{ name: "learning", score: 2, max: 3, percent: 67 }],
      },
    });
    expect(body.results[0].answers).toBeUndefined();
  });

  it("rejects invalid admin tokens and legacy token headers", async () => {
    const { env } = createEnv();

    const invalid = await worker.fetch(
      request("/api/admin/results", {
        headers: { Authorization: "Bearer wrong-token" },
      }),
      env
    );
    expect(invalid.status).toBe(401);

    const legacyHeader = await worker.fetch(
      request("/api/admin/results", {
        headers: { "X-Admin-Token": "secret-admin-token" },
      }),
      env
    );
    expect(legacyHeader.status).toBe(401);
  });

  it("rejects disallowed CORS origins", async () => {
    const { env } = createEnv();
    const response = await worker.fetch(
      new Request("https://api.example.com/api/admin/results", {
        headers: { Origin: "https://evil.example" },
      }),
      env
    );
    expect(response.status).toBe(403);
  });

  it("rejects invalid result ids safely", async () => {
    const { env } = createEnv();
    const response = await worker.fetch(
      request("/api/results/not-a-uuid"),
      env
    );
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid result id.",
    });
  });

  it("rejects HTML-like nicknames before storage", async () => {
    const { env, rows } = createEnv();
    const response = await worker.fetch(
      request("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: "<script>alert(1)</script>",
          testType: "adult",
          answers: { 1: 1 },
          domainScores: { learning: { score: 1, max: 3 } },
          totalScore: 1,
          maxScore: 45,
          riskLevel: "low",
          riskTitle: "Low",
          consentAgreed: true,
          createdAt: "2026-05-18T00:00:00.000Z",
        }),
      }),
      env
    );

    expect(response.status).toBe(400);
    expect(rows).toHaveLength(0);
  });

  it("handles SQL injection-like nickname as bound data", async () => {
    const { env, rows } = createEnv();
    const nickname = "x'); DROP TABLE t;--";
    const response = await worker.fetch(
      request("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          testType: "adult",
          answers: { 1: 1 },
          domainScores: { learning: { score: 1, max: 3 } },
          totalScore: 1,
          maxScore: 45,
          riskLevel: "low",
          riskTitle: "Low",
          consentAgreed: true,
          createdAt: "2026-05-18T00:00:00.000Z",
        }),
      }),
      env
    );

    expect(response.status).toBe(201);
    expect(rows).toHaveLength(1);
    expect(rows[0].nickname).toBe(nickname);
  });
});
