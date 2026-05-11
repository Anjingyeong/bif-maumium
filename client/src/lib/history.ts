/**
 * 검사 이력 관리 유틸리티
 * localStorage를 사용하여 브라우저를 닫아도 이력이 유지됩니다.
 * 개인 식별 정보는 일절 저장하지 않습니다.
 */

export interface TestRecord {
  id: string;
  type: 'adult' | 'child';
  score: number;
  maxScore: number;
  level: string;
  levelTitle: string;
  date: string; // ISO 8601
  categoryScores: Record<string, { score: number; max: number }>;
}

const HISTORY_KEY = 'bif_test_history';
const CONSENT_KEY = 'bif_consent_given';
const DATA_ALLOW_KEY = 'bif_allow_data';
const MAX_RECORDS = 20;

// ── 동의 관련 ──────────────────────────────────────────────────
export function getConsentGiven(): boolean {
  return localStorage.getItem(CONSENT_KEY) === 'true';
}

export function setConsentGiven(allowData: boolean): void {
  localStorage.setItem(CONSENT_KEY, 'true');
  localStorage.setItem(DATA_ALLOW_KEY, allowData ? 'true' : 'false');
}

/**
 * sessionStorage에 남아있는 이전 동의 기록을 localStorage로 마이그레이션
 * 앱 초기화 시 한 번 호출
 */
export function migrateSessionConsent(): void {
  if (localStorage.getItem(CONSENT_KEY)) return; // 이미 localStorage에 있으면 스킵
  const sessionConsent = sessionStorage.getItem('bif_consent_given');
  if (sessionConsent === 'true') {
    const sessionData = sessionStorage.getItem('bif_allow_data');
    localStorage.setItem(CONSENT_KEY, 'true');
    localStorage.setItem(DATA_ALLOW_KEY, sessionData ?? 'false');
  }
}

export function getAllowData(): boolean {
  return localStorage.getItem(DATA_ALLOW_KEY) === 'true';
}

// ── 검사 이력 관련 ─────────────────────────────────────────────
export function getHistory(): TestRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as TestRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveTestRecord(record: Omit<TestRecord, 'id' | 'date'>): TestRecord {
  const newRecord: TestRecord = {
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
  };

  const history = getHistory();
  const updated = [newRecord, ...history].slice(0, MAX_RECORDS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return newRecord;
}

export function getLastRecord(type: 'adult' | 'child'): TestRecord | null {
  const history = getHistory();
  return history.find(r => r.type === type) ?? null;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

// ── 점수 변화 계산 ─────────────────────────────────────────────
export function getScoreDiff(
  current: number,
  previous: number | null
): { diff: number; direction: 'up' | 'down' | 'same' } | null {
  if (previous === null) return null;
  const diff = current - previous;
  return {
    diff: Math.abs(diff),
    direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
  };
}

export function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}
