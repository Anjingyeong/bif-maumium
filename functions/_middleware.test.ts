import { describe, expect, it } from "vitest";
import { shouldUseSpaFallback } from "./_middleware";

describe("shouldUseSpaFallback", () => {
  it("returns true for extensionless app routes", () => {
    expect(shouldUseSpaFallback("/result")).toBe(true);
    expect(shouldUseSpaFallback("/result/summary")).toBe(true);
  });

  it("returns false for API, static, and blocked routes", () => {
    expect(shouldUseSpaFallback("/api/results")).toBe(false);
    expect(shouldUseSpaFallback("/assets/index.js")).toBe(false);
    expect(shouldUseSpaFallback("/.git/config")).toBe(false);
    expect(shouldUseSpaFallback("/debug")).toBe(false);
    expect(shouldUseSpaFallback("/404.html")).toBe(false);
  });
});
