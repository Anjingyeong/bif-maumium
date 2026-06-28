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

const LEGACY_HISTORY_KEY = 'bif_test_history';
const LEGACY_NOTIFY_EMAIL_KEY = 'bif_notify_email';
const LEGACY_ADMIN_TOKEN_KEY = 'bif_admin_token';
const LEGACY_FEEDBACK_KEY = 'bif_feedback';
const ANALYTICS_CONSENT_KEY = 'maumium_analytics_consent';
const TEST_NOTICE_CONFIRMED_KEY = 'maumium_test_notice_confirmed_session';
const ANONYMOUS_RESULT_CONSENT_KEY = 'maumium_anonymous_result_consent';
const OLD_CONSENT_KEY = 'bif_consent_given';
const OLD_DATA_ALLOW_KEY = 'bif_allow_data';

export function getConsentGiven(): boolean {
  return sessionStorage.getItem(TEST_NOTICE_CONFIRMED_KEY) === 'true';
}

export function setConsentGiven(allowData: boolean): void {
  sessionStorage.setItem(TEST_NOTICE_CONFIRMED_KEY, 'true');
  localStorage.setItem(ANONYMOUS_RESULT_CONSENT_KEY, allowData ? 'true' : 'false');
}

export function migrateSessionConsent(): void {
  if (localStorage.getItem(ANONYMOUS_RESULT_CONSENT_KEY) === null) {
    const oldAllow = localStorage.getItem(OLD_DATA_ALLOW_KEY);
    if (oldAllow !== null) {
      localStorage.setItem(ANONYMOUS_RESULT_CONSENT_KEY, oldAllow);
    }
  }

  if (sessionStorage.getItem(TEST_NOTICE_CONFIRMED_KEY) === null) {
    const oldNotice = localStorage.getItem(OLD_CONSENT_KEY);
    if (oldNotice === 'true') {
      sessionStorage.setItem(TEST_NOTICE_CONFIRMED_KEY, 'true');
    }
  }

  cleanupSensitiveBrowserStorage();
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

export function getHistory(): TestRecord[] {
  cleanupSensitiveBrowserStorage();
  return [];
}

export function saveTestRecord(record: Omit<TestRecord, 'id' | 'date'>): TestRecord {
  cleanupSensitiveBrowserStorage();
  return {
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
  };
}

export function getLastRecord(type: 'adult' | 'child'): TestRecord | null {
  void type;
  cleanupSensitiveBrowserStorage();
  return null;
}

export function clearHistory(): void {
  cleanupSensitiveBrowserStorage();
}

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

export function cleanupSensitiveBrowserStorage(): void {
  localStorage.removeItem(LEGACY_HISTORY_KEY);
  localStorage.removeItem(LEGACY_NOTIFY_EMAIL_KEY);
  localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
  localStorage.removeItem(LEGACY_FEEDBACK_KEY);
  localStorage.removeItem(OLD_CONSENT_KEY);
  localStorage.removeItem(OLD_DATA_ALLOW_KEY);

  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (!key) continue;
    if (key === ANALYTICS_CONSENT_KEY || key === ANONYMOUS_RESULT_CONSENT_KEY) continue;
    if (key.startsWith("maumium_")) {
      localStorage.removeItem(key);
    }
  }
}
