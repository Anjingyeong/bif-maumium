export type PdfDeliveryStrategy = "share" | "open" | "download";
export type PdfDeliveryResult = "shared" | "opened" | "downloaded";

type StrategyInput = {
  userAgent: string;
  canShareFiles: boolean;
};

const MOBILE_RE = /mobile|android|iphone|ipad|ipod/i;
const IOS_RE = /\b(iPad|iPhone|iPod)\b/i;

export function choosePdfDeliveryStrategy({
  userAgent,
  canShareFiles,
}: StrategyInput): PdfDeliveryStrategy {
  if (canShareFiles && MOBILE_RE.test(userAgent)) {
    return "share";
  }

  if (IOS_RE.test(userAgent)) {
    return "open";
  }

  return "download";
}

function canSharePdfFile(file: File): boolean {
  return Boolean(
    "share" in navigator &&
      "canShare" in navigator &&
      navigator.canShare({ files: [file] })
  );
}

function openPdfBlobUrl(blobUrl: string): void {
  const opened = window.open(blobUrl, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.assign(blobUrl);
  }
}

function downloadPdfBlobUrl(blobUrl: string, filename: string): void {
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export async function deliverPdfBlob(blob: Blob, filename: string): Promise<PdfDeliveryResult> {
  const file = new File([blob], filename, { type: "application/pdf" });
  const strategy = choosePdfDeliveryStrategy({
    userAgent: navigator.userAgent,
    canShareFiles: canSharePdfFile(file),
  });

  if (strategy === "share") {
    await navigator.share({ files: [file], title: filename });
    return "shared";
  }

  const blobUrl = window.URL.createObjectURL(blob);
  window.setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60_000);

  if (strategy === "open") {
    openPdfBlobUrl(blobUrl);
    return "opened";
  }

  downloadPdfBlobUrl(blobUrl, filename);
  return "downloaded";
}
