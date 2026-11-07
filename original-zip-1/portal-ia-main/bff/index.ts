import { readFileSync } from "node:fs";
import path from "node:path";
import { serve } from "@hono/node-server";
import { createPortalApp } from "./app.ts";
import { readConfig } from "./config.ts";
import { logToStdout } from "./log.ts";
import { createOidc } from "./oidc.ts";
import { createQueue } from "./queue.ts";

const SHUTDOWN_GRACE_MS = 8000;

try {
  const config = readConfig();
  const oidc = await createOidc({ tenantId: config.tenantId, clientId: config.clientId, clientSecret: config.clientSecret, publicUrl: config.publicUrl });
  const { version } = JSON.parse(readFileSync(path.resolve(import.meta.dirname, "../package.json"), "utf8")) as { version: string };
  const app = createPortalApp({
    root: path.resolve(import.meta.dirname, "../dist/client"),
    siteVersion: version,
    publicUrl: config.publicUrl,
    tenantId: config.tenantId,
    sessionPasswords: config.sessionPasswords,
    sessionDurationHours: config.sessionDurationHours,
    sharepointOrigin: config.sharepointOrigin,
    publisherEmails: config.publisherEmails,
    queue: config.publishBucket ? createQueue({ bucket: config.publishBucket }) : null,
    oidc,
  });
  const server = serve({ fetch: app.fetch, port: config.port }, () => logToStdout({ event: "SERVER_STARTED", url: config.publicUrl, port: config.port }));
  // A port already taken or refused arrives here, after serve() has returned.
  server.on("error", (error: Error) => {
    logToStdout({ event: "SERVER_START_FAILED", detail: error.message });
    process.exit(1);
  });
  // The platform sends SIGTERM and kills the process a few seconds later; finish open requests and leave before that.
  for (const signal of ["SIGTERM", "SIGINT"] as const) {
    process.on(signal, () => {
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(0), SHUTDOWN_GRACE_MS).unref();
    });
  }
} catch (error) {
  logToStdout({ event: "SERVER_START_FAILED", detail: error instanceof Error ? error.message : String(error) });
  process.exit(1);
}
