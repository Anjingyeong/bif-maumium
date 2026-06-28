import { describe, expect, it } from "vitest";
import { choosePdfDeliveryStrategy } from "./pdfDelivery";

describe("choosePdfDeliveryStrategy", () => {
  it("uses native file sharing when a mobile browser can share PDFs", () => {
    expect(
      choosePdfDeliveryStrategy({
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
        canShareFiles: true,
      })
    ).toBe("share");
  });

  it("opens the PDF in-browser on iOS when file sharing is unavailable", () => {
    expect(
      choosePdfDeliveryStrategy({
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
        canShareFiles: false,
      })
    ).toBe("open");
  });

  it("keeps anchor download for Android and desktop fallback paths", () => {
    expect(
      choosePdfDeliveryStrategy({
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/125.0 Mobile Safari/537.36",
        canShareFiles: false,
      })
    ).toBe("download");

    expect(
      choosePdfDeliveryStrategy({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0 Safari/537.36",
        canShareFiles: false,
      })
    ).toBe("download");
  });
});
