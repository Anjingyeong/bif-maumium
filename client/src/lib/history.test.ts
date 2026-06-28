import { beforeEach, describe, expect, it } from "vitest";
import {
  cleanupSensitiveBrowserStorage,
  getHistory,
  getLastRecord,
  migrateSessionConsent,
  saveTestRecord,
} from "./history";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

function installStorage() {
  Object.defineProperty(globalThis, "localStorage", {
    value: new MemoryStorage(),
    configurable: true,
  });
  Object.defineProperty(globalThis, "sessionStorage", {
    value: new MemoryStorage(),
    configurable: true,
  });
}

describe("browser storage history cleanup", () => {
  beforeEach(() => {
    installStorage();
  });

  it("does not persist screening records in localStorage", () => {
    const record = saveTestRecord({
      type: "adult",
      score: 8,
      maxScore: 36,
      level: "low",
      levelTitle: "낮음",
      categoryScores: {},
    });

    expect(record.score).toBe(8);
    expect(localStorage.getItem("bif_test_history")).toBeNull();
    expect(getHistory()).toEqual([]);
    expect(getLastRecord("adult")).toBeNull();
  });

  it("removes legacy sensitive keys while preserving allowed preferences", () => {
    localStorage.setItem("bif_test_history", "[]");
    localStorage.setItem("bif_notify_email", "user@example.com");
    localStorage.setItem("bif_feedback", "comment");
    localStorage.setItem("bif_admin_token", "secret");
    localStorage.setItem("bif_allow_data", "true");
    localStorage.setItem("bif_consent_given", "true");
    localStorage.setItem("maumium_result_id", "result-id");
    localStorage.setItem("maumium_analytics_consent", "true");
    localStorage.setItem("maumium_anonymous_result_consent", "false");
    localStorage.setItem("theme", "dark");

    cleanupSensitiveBrowserStorage();

    expect(localStorage.getItem("bif_test_history")).toBeNull();
    expect(localStorage.getItem("bif_notify_email")).toBeNull();
    expect(localStorage.getItem("bif_feedback")).toBeNull();
    expect(localStorage.getItem("bif_admin_token")).toBeNull();
    expect(localStorage.getItem("bif_allow_data")).toBeNull();
    expect(localStorage.getItem("bif_consent_given")).toBeNull();
    expect(localStorage.getItem("maumium_result_id")).toBeNull();
    expect(localStorage.getItem("maumium_analytics_consent")).toBe("true");
    expect(localStorage.getItem("maumium_anonymous_result_consent")).toBe("false");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("migrates old consent state before removing old keys", () => {
    localStorage.setItem("bif_allow_data", "true");
    localStorage.setItem("bif_consent_given", "true");

    migrateSessionConsent();

    expect(localStorage.getItem("maumium_anonymous_result_consent")).toBe("true");
    expect(sessionStorage.getItem("maumium_test_notice_confirmed_session")).toBe("true");
    expect(localStorage.getItem("bif_allow_data")).toBeNull();
    expect(localStorage.getItem("bif_consent_given")).toBeNull();
  });
});
