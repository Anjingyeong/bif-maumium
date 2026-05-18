import type { AnswerValue } from "@/lib/questions";

export type TestType = "adult" | "child";

export type CategoryScores = Record<string, { score: number; max: number }>;

export interface ResultSavePayload {
  nickname: string;
  testType: TestType;
  answers: Record<number, AnswerValue>;
  categoryScores: CategoryScores;
  totalScore: number;
  maxScore: number;
  riskLevel: string;
  riskTitle: string;
  consentGiven: boolean;
}

export interface SavedResultSummary {
  id: string;
  nickname: string;
  testType: TestType;
  totalScore: number;
  maxScore: number;
  riskLevel: string;
  riskTitle: string;
  submittedAt: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

export function hasRemoteResultApi(): boolean {
  return API_BASE_URL.length > 0;
}

export async function saveResultToApi(
  payload: ResultSavePayload
): Promise<SavedResultSummary> {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${API_BASE_URL}/api/results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || "Failed to save result.");
  }

  return response.json() as Promise<SavedResultSummary>;
}
