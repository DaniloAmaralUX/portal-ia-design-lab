import type { PublishRequest } from "./files";

export type Submission =
  // The request went to the queue, and the Merge Request comes later, from a job of the GitLab. It is not shown: who publishes is not on the GitLab.
  | { state: "sent" }
  | { state: "unavailable" }
  // canCopy: the failure is the server's or the network's, so the file is fine and can be created by hand. A refusal of the content
  // or of the address (a 4xx) leaves nothing worth copying.
  | { state: "refused"; message: string; canCopy: boolean };

const FAILED = "Não foi possível enviar a solicitação agora. Tente de novo, ou copie o arquivo abaixo e mande para o time do portal.";

function messageOf(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return null;
  const { message } = body as { message?: unknown };
  return typeof message === "string" && message ? message : null;
}

export async function submitForReview(request: PublishRequest): Promise<Submission> {
  try {
    // X-Portal is the custom header the BFF asks for, which a form or a link on another site cannot send.
    const response = await fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Portal": "publish" },
      body: JSON.stringify(request),
    });
    const body: unknown = await response.json().catch(() => null);
    if (response.status === 503) return { state: "unavailable" };
    if (response.status === 202) return { state: "sent" };
    if (response.status === 401 || response.status === 403) {
      return { state: "refused", message: "Sua sessão acabou ou você não está na lista de quem publica. Entre de novo e tente outra vez.", canCopy: false };
    }
    return { state: "refused", message: messageOf(body) ?? FAILED, canCopy: response.status >= 500 };
  } catch {
    return { state: "refused", message: FAILED, canCopy: true };
  }
}
