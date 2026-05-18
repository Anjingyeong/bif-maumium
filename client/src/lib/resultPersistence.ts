import type { AnswerValue } from "@/lib/questions";

export type TestType = "adult" | "child";

export type CategoryScores = Record<string, { score: number; max: number }>;

export interface ResultSavePayload {
  nickname: string;
  testType: TestType;
  answers: Record<number, AnswerValue>;
  domainScores: CategoryScores;
  totalScore: number;
  maxScore: number;
  riskLevel: string;
  riskTitle: string;
  consentAgreed: boolean;
  createdAt: string;
}

export interface SavedResultSummary {
  id: string;
  nickname: string;
  testType: TestType;
  totalScore: number;
  maxScore: number;
  riskLevel: string;
  riskTitle: string;
  consentAgreed: boolean;
  createdAt: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

export function hasRemoteResultApi(): boolean {
  return true;
}

export async function saveResultToApi(
  payload: ResultSavePayload
): Promise<SavedResultSummary> {
  const endpoint = API_BASE_URL ? `${API_BASE_URL}/api/results` : "/api/results";
  const response = await fetch(endpoint, {
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
