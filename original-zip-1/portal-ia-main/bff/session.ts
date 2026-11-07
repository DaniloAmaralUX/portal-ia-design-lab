import { sealData, unsealData } from "iron-session";

export const IDLE_TIMEOUT_SECONDS = 60 * 60;
export const LOGIN_ATTEMPT_SECONDS = 10 * 60;

type Kind = "session" | "login";

// iron-session encrypts and signs the value and enforces the seal's own expiry. The kind inside keeps a cookie sealed for one purpose from opening as the other.
export function createSealer(passwords: Record<string, string>) {
  return {
    seal: (kind: Kind, data: object, ttlSeconds: number) => sealData({ ...data, kind }, { password: passwords, ttl: ttlSeconds }),
    async open<T extends object>(kind: Kind, token: string | undefined): Promise<T | null> {
      if (!token) return null;
      const data = await unsealData<T & { kind?: Kind }>(token, { password: passwords });
      return data.kind === kind ? data : null;
    },
  };
}
