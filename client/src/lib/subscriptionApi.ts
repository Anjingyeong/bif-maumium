export interface SubscriptionResponse {
  ok: boolean;
  status?: "created" | "already_exists";
  error?: "invalid_email" | "server_error" | "network_error" | string;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/+$/,
  ""
);

export async function subscribeEmail(
  email: string
): Promise<SubscriptionResponse> {
  try {
    const endpoint = API_BASE_URL
      ? `${API_BASE_URL}/api/subscriptions`
      : "/api/subscriptions";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        ok: false,
        error: body?.error || "invalid_email",
      };
    }

    return body as SubscriptionResponse;
  } catch (error) {
    console.error("Subscription request failed:", error);
    return {
      ok: false,
      error: "network_error",
    };
  }
}
