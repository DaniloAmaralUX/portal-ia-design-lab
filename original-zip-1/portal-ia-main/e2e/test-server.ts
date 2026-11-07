import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { serve } from "@hono/node-server";
import { createPortalApp, type Oidc } from "../bff/app.ts";
import { buildConfig } from "../scripts/build-config.ts";

const PORT = 5191;
const TEST_TENANT_ID = "00000000-0000-4000-8000-000000000001";
const publicUrl = `http://localhost:${PORT}`;

const testLogin: Oidc = {
  authorizationUrl: (attempt) => Promise.resolve(`${publicUrl}/auth/callback?code=test&state=${encodeURIComponent(attempt.state)}`),
  exchangeCode: (url, attempt) =>
    url.searchParams.get("code") === "test" && url.searchParams.get("state") === attempt.state
      ? Promise.resolve({
          tid: TEST_TENANT_ID,
          acct: 0,
          iss: `https://login.microsoftonline.com/${TEST_TENANT_ID}/v2.0`,
          oid: "test-person",
          name: "Test Person",
          preferred_username: "test.person@pitang.com",
        })
      : Promise.reject(new Error("The test login only accepts the code and state it issued.")),
  logoutUrl: () => `${publicUrl}/`,
};

const { version } = JSON.parse(readFileSync(path.resolve(import.meta.dirname, "../package.json"), "utf8")) as { version: string };

const app = createPortalApp({
  root: path.resolve(import.meta.dirname, "../dist/client"),
  siteVersion: version,
  publicUrl,
  tenantId: TEST_TENANT_ID,
  sessionPasswords: { 1: randomBytes(32).toString("base64") },
  oidc: testLogin,
  // The same origin the build put in the page, so the header lets in the iframe the page draws.
  sharepointOrigin: buildConfig().sharepointOrigin,
  // The test account publishes, so the browser tests open the pages of /publicar.
  publisherEmails: ["test.person@pitang.com"],
});

serve({ fetch: app.fetch, port: PORT, hostname: "localhost" }, () => console.warn(`Browser test server on ${publicUrl}`));
