// canPublish comes from the BFF, which keeps the list of who publishes. It only shows or hides the pages of /publicar: what
// publishes checks the list again on the server.
export type Account = { name: string; email: string; canPublish: boolean };

let account: Account | null = null;
let requested = false;
let loaded = false;
const listeners = new Set<() => void>();

function parseAccount(data: unknown): Account | null {
  if (!data || typeof data !== "object") return null;
  const { name, email, canPublish } = data as Partial<Record<keyof Account, unknown>>;
  return typeof name === "string" && name ? { name, email: typeof email === "string" ? email : "", canPublish: canPublish === true } : null;
}

async function fetchAccount(): Promise<void> {
  try {
    const response = await fetch("/api/me", { headers: { Accept: "application/json" } });
    const data: unknown = response.ok ? await response.json() : null;
    account = parseAccount(data);
  } catch {
    account = null;
  }
  loaded = true;
  for (const notify of listeners) notify();
}

export function subscribeToAccount(notify: () => void): () => void {
  listeners.add(notify);
  if (!requested) {
    requested = true;
    void fetchAccount();
  }
  return () => {
    listeners.delete(notify);
  };
}

export const currentAccount = (): Account | null => account;

// Tells "the answer of /api/me has not come yet" apart from "there is no account".
export const accountLoaded = (): boolean => loaded;

export async function logout(): Promise<void> {
  try {
    const response = await fetch("/auth/logout", { method: "POST", headers: { "X-Portal": "logout" } });
    const { destination } = (await response.json()) as { destination?: string };
    window.location.assign(destination ?? "/");
  } catch {
    window.location.assign("/");
  }
}
