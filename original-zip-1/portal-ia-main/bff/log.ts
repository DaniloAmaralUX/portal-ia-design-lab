import type { LoginError } from "./login-page.ts";

type Identity = { email?: string; oid?: string; tid?: string };

export type LogEntry =
  | { event: "SERVER_STARTED"; url: string; port: number }
  | { event: "SERVER_START_FAILED"; detail: string }
  | ({ event: "LOGIN_SUCCESS" } & Identity)
  | ({ event: "LOGIN_DENIED"; reason: LoginError; idpError?: string; aadsts?: string; detail?: string } & Identity)
  | ({ event: "LOGOUT" } & Identity)
  | { event: "SERVER_ERROR"; detail: string };

export type Logger = (entry: LogEntry) => void;

const SEVERITY: Record<LogEntry["event"], "INFO" | "WARNING" | "ERROR"> = {
  SERVER_STARTED: "INFO",
  SERVER_START_FAILED: "ERROR",
  LOGIN_SUCCESS: "INFO",
  LOGIN_DENIED: "WARNING",
  LOGOUT: "INFO",
  SERVER_ERROR: "ERROR",
};

export const logToStdout: Logger = (entry) => {
  process.stdout.write(`${JSON.stringify({ severity: SEVERITY[entry.event], ...entry, time: new Date().toISOString() })}\n`);
};
