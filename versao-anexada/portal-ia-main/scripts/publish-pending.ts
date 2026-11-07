import { readFileSync } from "node:fs";
import path from "node:path";
import { parseQueueEntry } from "../src/shared/publish-request.ts";
import { createPublisher, type PublishResult } from "./publish-gitlab.ts";

// One request of the queue of /publicar, turned into a Merge Request. The job of the GitLab CI runs it once for each object of the
// bucket and reads the exit code to know where the object goes next: 0 is a Merge Request opened, so the object goes to feitos/;
// 3 is a refusal that another try would repeat (a wrong shape, an address taken, a course that does not exist), so it goes to
// falhas/; 1 is a failure of the moment (the GitLab did not answer), so it stays in pending/ for the next run.
//
//   printf %s "$TOKEN" | node scripts/publish-pending.ts <file.json> --gitlab <https://host> --project <id or group/project> [--sharepoint <origin>]
//
// The token comes by stdin, and not by argument, so it never shows in the list of processes. This file reads no environment variable:
// scripts/environment.test.ts allows only two readers of the environment.

export const CREATED = 0;
export const TRANSIENT = 1;
export const REFUSED = 3;

export type Outcome = { code: typeof CREATED | typeof TRANSIENT | typeof REFUSED; message: string };

export async function processEntry(raw: string, publisher: { submit: (...args: Parameters<ReturnType<typeof createPublisher>["submit"]>) => Promise<PublishResult> }): Promise<Outcome> {
  const entry = parseQueueEntry(raw);
  if (!entry) return { code: REFUSED, message: "the file is not a request of /publicar" };
  const result = await publisher.submit(entry.request, entry.author);
  if (result.ok) return { code: CREATED, message: `Merge Request opened on ${result.branch}: ${result.url}` };
  const detail = result.detail ? ` (${result.detail})` : "";
  return { code: result.error === "upstream" ? TRANSIENT : REFUSED, message: `${result.error}: ${result.message}${detail}` };
}

function option(args: string[], name: string): string | undefined {
  const at = args.indexOf(name);
  return at >= 0 ? args[at + 1] : undefined;
}

// The token goes to this address, so it has to be an https origin: no other scheme, no path, no credentials in it.
function originOf(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.pathname === "/" && !url.search && !url.hash && !url.username && !url.password ? url.origin : null;
  } catch {
    return null;
  }
}

async function main(args: string[]): Promise<number> {
  const [file] = args;
  const apiUrl = originOf(option(args, "--gitlab"));
  const projectId = option(args, "--project");
  const token = readFileSync(0, "utf8").trim();
  if (!file || file.startsWith("--") || !apiUrl || !projectId || !token) {
    console.error("usage: printf %s \"$TOKEN\" | node scripts/publish-pending.ts <file.json> --gitlab <https://host> --project <id or path> [--sharepoint <origin>]");
    return TRANSIENT;
  }
  const publisher = createPublisher({ gitlab: { apiUrl, projectId, token }, sharepointOrigin: option(args, "--sharepoint") || null });
  const outcome = await processEntry(readFileSync(file, "utf8"), publisher);
  console.warn(`${path.basename(file)}: ${outcome.message}`);
  return outcome.code;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  process.exitCode = await main(process.argv.slice(2));
}
