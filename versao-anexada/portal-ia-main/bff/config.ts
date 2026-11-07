import { sharepointOriginFrom } from "../src/shared/sharepoint-origin.ts";

type Config = {
  publicUrl: string;
  tenantId: string;
  clientId: string;
  clientSecret: string;
  sessionPasswords: Record<string, string>;
  sessionDurationHours: number;
  port: number;
  sharepointOrigin: string | null;
  publisherEmails: string[];
  publishBucket: string | null;
};

type Environment = Record<string, string | undefined>;

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// The aliases of the Microsoft endpoint that accept accounts from any directory. The portal is for Pitang's accounts only.
const MULTI_TENANT = new Set(["common", "organizations", "consumers"]);
const LOCALHOST = new Set(["localhost", "127.0.0.1", "[::1]"]);
const EMAIL = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;

function required(env: Environment, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new Error(`Missing environment variable ${name}. See .env.example.`);
  return value;
}

function originFrom(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`PORTAL_URL must be an absolute URL, like https://portal.example.com. Got "${value}".`);
  }
  if (url.protocol !== "https:" && !(url.protocol === "http:" && LOCALHOST.has(url.hostname))) {
    throw new Error("PORTAL_URL must use https, except on localhost.");
  }
  if (url.pathname !== "/" || url.search || url.hash) throw new Error("PORTAL_URL must be an origin, without a path, query or fragment.");
  return url.origin;
}

function numberFrom(env: Environment, name: string, fallback: number, limits: { min: number; max: number; integer: boolean }): number {
  const raw = env[name]?.trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < limits.min || value > limits.max || (limits.integer && !Number.isInteger(value))) {
    throw new Error(`${name} must be ${limits.integer ? "an integer" : "a number"} from ${limits.min} to ${limits.max}. Got "${raw}".`);
  }
  return value;
}

const MIN_SECRET_LENGTH = 32;

// SESSION_SECRET is one secret, or numbered ones to rotate it: "2:new-secret,1:old-secret". The highest number seals, and all of them open.
function passwordsFrom(raw: string): Record<string, string> {
  const parts = raw.split(",").map((part) => part.trim());
  const numbered = parts.every((part) => /^\d+:./.test(part));
  const entries: [string, string][] = numbered ? parts.map((part) => [part.slice(0, part.indexOf(":")), part.slice(part.indexOf(":") + 1)]) : [["1", raw]];
  if (new Set(entries.map(([id]) => Number(id))).size !== entries.length) throw new Error("SESSION_SECRET repeats a key number.");
  for (const [id, secret] of entries) {
    if (secret.length < MIN_SECRET_LENGTH) {
      throw new Error(`SESSION_SECRET must have at least ${MIN_SECRET_LENGTH} random characters in each secret (key ${id}), like the output of openssl rand -base64 48.`);
    }
  }
  return Object.fromEntries(entries);
}

function tenantFrom(value: string): string {
  if (MULTI_TENANT.has(value.toLowerCase())) {
    throw new Error(`MICROSOFT_TENANT_ID must be the directory (tenant) ID of Pitang, a GUID. "${value}" lets accounts of other directories in, and only Pitang may sign in.`);
  }
  if (!GUID.test(value)) throw new Error(`MICROSOFT_TENANT_ID must be the directory (tenant) ID of Pitang, a GUID. Got "${value}".`);
  return value.toLowerCase();
}

// The people who may publish to the Academy, by the e-mail of their Microsoft login, compared in lower case. Without the
// variable nobody may publish.
function emailsFrom(raw: string | undefined): string[] {
  const value = raw?.trim();
  if (!value) return [];
  const emails = value.split(",").map((email) => email.trim().toLowerCase());
  const wrong = emails.find((email) => !EMAIL.test(email));
  if (wrong !== undefined) throw new Error(`PUBLISHER_EMAILS must be e-mails separated by commas, like ana@pitang.com,bruno@pitang.com. Got "${wrong}".`);
  return [...new Set(emails)];
}

// The bucket of the queue of /publicar: letters, digits, dots, dashes and underscores, from 3 to 63 characters, as Cloud Storage names it.
// Without the variable the portal has no queue, and the send answers that it is not on.
const BUCKET = /^[a-z0-9][a-z0-9._-]{1,61}[a-z0-9]$/;

function bucketFrom(raw: string | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;
  if (!BUCKET.test(value)) throw new Error(`PUBLISH_BUCKET must be the name of a Cloud Storage bucket, like portal-ia-publish. Got "${value}".`);
  return value;
}

export function readConfig(env: Environment = process.env): Config {
  const publicUrl = originFrom(required(env, "PORTAL_URL"));
  const tenantId = tenantFrom(required(env, "MICROSOFT_TENANT_ID"));
  const clientId = required(env, "MICROSOFT_CLIENT_ID");
  if (!GUID.test(clientId)) throw new Error("MICROSOFT_CLIENT_ID must be the application (client) ID of the app registration, a GUID.");
  const clientSecret = required(env, "MICROSOFT_CLIENT_SECRET");
  const sessionPasswords = passwordsFrom(required(env, "SESSION_SECRET"));
  return {
    publicUrl,
    tenantId,
    clientId,
    clientSecret,
    sessionPasswords,
    sessionDurationHours: numberFrom(env, "SESSION_DURATION_HOURS", 8, { min: 0.25, max: 24, integer: false }),
    port: numberFrom(env, "PORT", 8080, { min: 1, max: 65535, integer: true }),
    sharepointOrigin: env.SHAREPOINT_ORIGIN?.trim() ? sharepointOriginFrom(env.SHAREPOINT_ORIGIN.trim()) : null,
    publisherEmails: emailsFrom(env.PUBLISHER_EMAILS),
    publishBucket: bucketFrom(env.PUBLISH_BUCKET),
  };
}
