import { randomUUID } from "node:crypto";
import type { PublishRequest } from "../src/shared/publish-files.ts";
import type { QueueEntry } from "../src/shared/publish-request.ts";

// The queue of /publicar is a bucket of Cloud Storage. The portal only creates objects in pending/, with the identity of the service
// account of Cloud Run, and a job of the GitLab CI, which can reach the GitLab, reads them and opens the Merge Requests. The portal
// never calls the GitLab, and no key is stored: the token comes from the metadata server of Cloud Run.
const METADATA_TOKEN = "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token";
const UPLOAD = "https://storage.googleapis.com/upload/storage/v1/b";
const TIMEOUT_MS = 10_000;
// The token is renewed a minute before it expires, so a request never leaves with one that is about to.
const EXPIRY_MARGIN_MS = 60_000;

export type Queue = { add: (request: PublishRequest, author: string) => Promise<void> };

// A failed fetch says only "fetch failed": the reason (a timeout, a refused connection) is in the cause.
function detailOf(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const cause = error.cause;
  const reason = cause instanceof Error ? ((cause as Error & { code?: string }).code ?? cause.message) : undefined;
  return reason ? `${error.message} (${reason})` : error.message;
}

export function createQueue({ bucket, fetch: fetchImpl = fetch, now = Date.now }: { bucket: string; fetch?: typeof fetch; now?: () => number }): Queue {
  let cached: { token: string; expiresAt: number } | null = null;

  async function accessToken(): Promise<string> {
    if (cached && cached.expiresAt > now()) return cached.token;
    const response = await fetchImpl(METADATA_TOKEN, { headers: { "Metadata-Flavor": "Google" }, redirect: "error", signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) throw new Error(`metadata server answered ${response.status}`);
    const body = (await response.json()) as { access_token?: unknown; expires_in?: unknown };
    if (typeof body.access_token !== "string" || typeof body.expires_in !== "number") throw new Error("metadata server sent no token");
    cached = { token: body.access_token, expiresAt: now() + body.expires_in * 1000 - EXPIRY_MARGIN_MS };
    return cached.token;
  }

  return {
    // ifGenerationMatch=0 makes the upload fail if an object of that name exists, so a request is never overwritten.
    async add(request, author) {
      const entry: QueueEntry = { version: 1, receivedAt: new Date(now()).toISOString(), author, request };
      const name = `pending/${new Date(now()).toISOString().replace(/[-:.]/g, "")}-${randomUUID()}.json`;
      try {
        const response = await fetchImpl(`${UPLOAD}/${encodeURIComponent(bucket)}/o?uploadType=media&name=${encodeURIComponent(name)}&ifGenerationMatch=0`, {
          method: "POST",
          headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
          body: JSON.stringify(entry),
          redirect: "error",
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!response.ok) throw new Error(`storage answered ${response.status}`);
      } catch (error) {
        throw new Error(detailOf(error), { cause: error });
      }
    },
  };
}
