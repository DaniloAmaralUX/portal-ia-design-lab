import { afterEach, describe, expect, it, vi } from "vitest";
import { logToStdout } from "./log.ts";

describe("the stdout logger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes one JSON line per event, with the severity and the time", () => {
    const write = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    logToStdout({ event: "LOGIN_SUCCESS", email: "ana.souza@pitang.com" });
    logToStdout({ event: "LOGIN_DENIED", reason: "account", email: "someone@other.com" });
    logToStdout({ event: "SERVER_ERROR", detail: "boom" });
    logToStdout({ event: "SERVER_STARTED", url: "https://portal.example.com", port: 8080 });
    logToStdout({ event: "SERVER_START_FAILED", detail: "Missing environment variable PORTAL_URL." });
    const lines = write.mock.calls.map(([line]) => String(line));
    expect(lines.every((line) => line.endsWith("\n") && !line.slice(0, -1).includes("\n"))).toBe(true);
    const [success, denied, error, started, failed] = lines.map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(success).toMatchObject({ severity: "INFO", event: "LOGIN_SUCCESS", email: "ana.souza@pitang.com" });
    expect(denied).toMatchObject({ severity: "WARNING", event: "LOGIN_DENIED", reason: "account" });
    expect(error).toMatchObject({ severity: "ERROR", event: "SERVER_ERROR", detail: "boom" });
    expect(started).toMatchObject({ severity: "INFO", event: "SERVER_STARTED", port: 8080 });
    expect(failed).toMatchObject({ severity: "ERROR", event: "SERVER_START_FAILED" });
    expect(Number.isNaN(Date.parse(String(success?.time)))).toBe(false);
  });
});
