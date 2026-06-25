export interface SendEmailOptions {
  readonly to: string;
  readonly from: string;
  readonly subject: string;
  readonly html: string;
  readonly text?: string;
}

export interface EmailProvider {
  send(options: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }>;
}

export class ResendEmailProvider implements EmailProvider {
  private readonly apiKey: string | null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey?.trim() || null;
  }

  async send(options: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!this.apiKey) {
      // Mock mode when API key is missing
      console.log(`[Email Mock] Would send email to: ${options.to.split("@")[0]}***@*** (Subject: "${options.subject}")`);
      return { success: true, id: `mock-${crypto.randomUUID()}` };
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: options.from,
          to: [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      const body = (await response.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };

      if (!response.ok) {
        console.error(`[Resend Error] Failed to send email. Code: ${response.status}, Message: ${body.message || "Unknown error"}`);
        return { success: false, error: body.message || "Failed to send email via Resend API" };
      }

      return { success: true, id: body.id };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[Resend Connection Error] ${errorMsg}`);
      return { success: false, error: errorMsg };
    }
  }
}
