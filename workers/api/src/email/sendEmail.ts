import { ResendEmailProvider } from "./provider";
import { getUpdateNoticeTemplate } from "./templates/updateNotice";

export interface SendUpdateEmailOptions {
  readonly to: string;
  readonly apiKey?: string;
  readonly fromName?: string;
  readonly fromAddress?: string;
  readonly unsubscribeUrl?: string;
}

export async function sendUpdateNoticeEmail(
  options: SendUpdateEmailOptions
): Promise<{ success: boolean; id?: string; error?: string }> {
  // 1. Setup default sender info (Resend uses format: Name <email@domain.com>)
  const senderName = options.fromName || "마음이음";
  const senderAddress = options.fromAddress || "no-reply@maumium.com";
  const from = `${senderName} <${senderAddress}>`;

  // 2. Render HTML & Text template
  const template = getUpdateNoticeTemplate({
    email: options.to,
    unsubscribeUrl: options.unsubscribeUrl,
  });

  // 3. Load provider (automatically defaults to mock mode if options.apiKey is missing)
  const provider = new ResendEmailProvider(options.apiKey);

  // 4. Send email
  return provider.send({
    to: options.to,
    from,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}
