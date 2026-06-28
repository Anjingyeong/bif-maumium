export type PdfDeliveryStrategy = "share" | "open" | "download";
export type PdfDeliveryResult = {
  strategy: PdfDeliveryStrategy;
  success: boolean;
  blobUrl?: string;
  error?: string;
};

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
  try {
    return Boolean(
      "share" in navigator &&
        "canShare" in navigator &&
        navigator.canShare({ files: [file] })
    );
  } catch {
    return false;
  }
}

export async function deliverPdfBlob(blob: Blob, filename: string): Promise<PdfDeliveryResult> {
  const file = new File([blob], filename, { type: "application/pdf" });
  let strategy = choosePdfDeliveryStrategy({
    userAgent: navigator.userAgent,
    canShareFiles: canSharePdfFile(file),
  });

  const blobUrl = window.URL.createObjectURL(blob);
  // Revoke resources after 3 minutes to give the user enough time
  window.setTimeout(() => window.URL.revokeObjectURL(blobUrl), 180_000);

  if (strategy === "share") {
    try {
      await navigator.share({ files: [file], title: filename });
      return { strategy: "share", success: true };
    } catch (shareErr: any) {
      console.warn("[PDF Delivery] navigator.share failed, falling back to open/download", shareErr);
      strategy = IOS_RE.test(navigator.userAgent) ? "open" : "download";
    }
  }

  if (strategy === "open") {
    try {
      const opened = window.open(blobUrl, "_blank", "noopener,noreferrer");
      if (opened) {
        return { strategy: "open", success: true };
      } else {
        console.warn("[PDF Delivery] window.open returned null (pop-up blocked)");
        return { strategy: "open", success: false, blobUrl };
      }
    } catch (openErr: any) {
      console.warn("[PDF Delivery] window.open threw error", openErr);
      return { strategy: "open", success: false, blobUrl, error: openErr?.message || String(openErr) };
    }
  }

  try {
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = filename;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    return { strategy: "download", success: true };
  } catch (dlErr: any) {
    console.error("[PDF Delivery] anchor download failed", dlErr);
    return { strategy: "download", success: false, blobUrl, error: dlErr?.message || String(dlErr) };
  }
}
