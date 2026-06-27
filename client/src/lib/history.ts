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
const MAX_RECORDS = 20;

// New Keys
const ANALYTICS_CONSENT_KEY = 'maumium_analytics_consent';
const TEST_NOTICE_CONFIRMED_KEY = 'maumium_test_notice_confirmed_session';
const ANONYMOUS_RESULT_CONSENT_KEY = 'maumium_anonymous_result_consent';

// Old Keys for Migration
const OLD_CONSENT_KEY = 'bif_consent_given';
const OLD_DATA_ALLOW_KEY = 'bif_allow_data';

// ── 동의 관련 ──────────────────────────────────────────────────
export function getConsentGiven(): boolean {
  return sessionStorage.getItem(TEST_NOTICE_CONFIRMED_KEY) === 'true';
}

export function setConsentGiven(allowData: boolean): void {
  sessionStorage.setItem(TEST_NOTICE_CONFIRMED_KEY, 'true');
  localStorage.setItem(ANONYMOUS_RESULT_CONSENT_KEY, allowData ? 'true' : 'false');
}

/**
 * 기존 동의 기록을 새로운 키로 마이그레이션
 */
export function migrateSessionConsent(): void {
  // Migrate anonymous result consent
  if (localStorage.getItem(ANONYMOUS_RESULT_CONSENT_KEY) === null) {
    const oldAllow = localStorage.getItem(OLD_DATA_ALLOW_KEY);
    if (oldAllow !== null) {
      localStorage.setItem(ANONYMOUS_RESULT_CONSENT_KEY, oldAllow);
    }
  }
  
  // Migrate notice consent from old localStorage if available in session
  if (sessionStorage.getItem(TEST_NOTICE_CONFIRMED_KEY) === null) {
    const oldNotice = localStorage.getItem(OLD_CONSENT_KEY);
    if (oldNotice === 'true') {
      sessionStorage.setItem(TEST_NOTICE_CONFIRMED_KEY, 'true');
    }
  }
}

export function getAllowData(): boolean {
  if (localStorage.getItem(ANONYMOUS_RESULT_CONSENT_KEY) === null) {
    const oldAllow = localStorage.getItem(OLD_DATA_ALLOW_KEY);
    if (oldAllow !== null) {
      localStorage.setItem(ANONYMOUS_RESULT_CONSENT_KEY, oldAllow);
    }
  }
  return localStorage.getItem(ANONYMOUS_RESULT_CONSENT_KEY) !== 'false';
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
