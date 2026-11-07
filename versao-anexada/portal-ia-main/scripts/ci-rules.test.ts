import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const CI = readFileSync(path.resolve(import.meta.dirname, "../.gitlab-ci.yml"), "utf8");

// The text of one hidden job, from its name to the next line that starts a new top-level key.
const block = (name: string) => new RegExp(`^${name.replace(".", "\\.")}:\\n([\\s\\S]*?)(?=^\\S)`, "m").exec(CI)?.[1] ?? "";

// The words GitLab reserves at the root of the file. A job with one of these names is read as the keyword, so the whole file is refused:
// "image" as a job became "image name should be a string" in the pipeline of the merge request.
const RESERVED = ["image", "services", "cache", "before_script", "after_script", "variables", "stages", "include", "workflow", "default", "pages"];

// The keys of the root with the text under each, so a job can be told from a keyword: a job has a script or an extends inside.
function rootBlocks(): { name: string; body: string }[] {
  const lines = CI.split("\n");
  const starts = lines.flatMap((line, i) => (/^([A-Za-z_.][\w.-]*):/.exec(line) ? [i] : []));
  return starts.map((start, n) => ({ name: /^([^:]+):/.exec(lines[start] ?? "")?.[1] ?? "", body: lines.slice(start + 1, starts[n + 1] ?? lines.length).join("\n") }));
}

describe(".gitlab-ci.yml", () => {
  it("has no job named after a word that GitLab reserves at the root", () => {
    const jobs = rootBlocks().filter(({ body }) => /^ {2}(script|extends):/m.test(body));
    expect(jobs.length).toBeGreaterThan(3);
    expect(jobs.filter(({ name }) => RESERVED.includes(name)).map(({ name }) => name)).toEqual([]);
  });

  it("installs the CA certificates with git, or the clone can't verify the https of the GitLab", () => {
    const installs = CI.split("\n").filter((line) => /apt-get install[^)]*\bgit\b/.test(line));
    expect(installs.length).toBeGreaterThan(0);
    for (const line of installs) expect(line).toContain("ca-certificates");
  });

  it("keeps the web vitals out of the pipeline, because the shared runner times its own CPU and not the page", () => {
    expect(block("browser")).toContain("npx playwright test --grep-invert @vitals");
    expect(CI).not.toMatch(/--grep @vitals/);
    expect(rootBlocks().map(({ name }) => name)).not.toContain("vitals");
  });

  it("publishes only for the stable ref of the skills, and with every variable set", () => {
    const rule = /rules:\n\s+- if: >-\n([\s\S]*?)\n\n/.exec(block(".publish"))?.[1] ?? "";
    expect(rule).toContain('$SKILLS_REF == "stable"');
    expect(rule).toContain("$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH");
    for (const name of ["GCP_PROJECT_ID", "PORTAL_URL", "MICROSOFT_TENANT_ID", "SESSION_SECRET_VERSION"]) expect(rule).toContain(`$${name}`);
  });

  it("clones through the script that takes the job token out of the clone, and pins the revision", () => {
    expect(block(".clone-skills")).toContain("sh deploy/clone-skills.sh");
    const script = readFileSync(path.resolve(import.meta.dirname, "../deploy/clone-skills.sh"), "utf8");
    expect(script.indexOf("git clone")).toBeGreaterThan(-1);
    expect(script.indexOf('remote set-url origin "$SKILLS_REPO_URL"')).toBeGreaterThan(script.indexOf("git clone"));
    expect(script).toContain('checkout --quiet -B "$SKILLS_REF" "$pin"');
  });

  it("hands the commit of the first clone to the other jobs: verify records it, browser and build-image receive it", () => {
    const verify = block("verify");
    expect(verify).toContain("sh deploy/clone-skills.sh skills.env");
    expect(verify).toMatch(/reports:\n\s+dotenv: skills\.env/);
    // Artifacts of a needed job come with its dotenv variables, and both jobs clone with the script that reads SKILLS_SHA.
    expect(block("browser")).toMatch(/needs:\n\s+- verify\n/);
    expect(block("browser")).toContain("!reference [.clone-skills, script]");
    expect(block("build-image")).toMatch(/needs:\n\s+- job: verify\n\s+artifacts: true/);
    expect(block("build-image")).toContain("!reference [.clone-skills, script]");
  });

  it("writes the .build-env through the script that checks the values", () => {
    expect(CI).toContain("sh deploy/write-build-env.sh");
    expect(CI).not.toMatch(/printf .*\.build-env/);
  });

  it("keeps the scheduled pipeline to the queue of /publicar: verify, browser, build-image and deploy leave it out", () => {
    for (const name of ["verify", "browser"]) expect(block(name), name).toMatch(/rules:\n\s+- if: \$CI_PIPELINE_SOURCE == "schedule"\n\s+when: never\n\s+- when: on_success/);
    // build-image and deploy take the condition of .publish, so one line keeps both out.
    expect(/rules:\n\s+- if: >-\n([\s\S]*?)\n\n/.exec(block(".publish"))?.[1]).toContain('$CI_PIPELINE_SOURCE != "schedule"');
    expect(block("build-image")).toContain("extends: .publish");
    expect(block("deploy")).toContain("extends: .publish");
  });

  it("runs the queue only on a schedule of the default branch, with the bucket and the token set, and with the identity of the deploy", () => {
    const job = rootBlocks().find(({ name }) => name === "publicar-pendentes")?.body ?? "";
    expect(rootBlocks().map(({ name }) => name)).toContain("publicar-pendentes");
    expect(job).toContain("stage: queue");
    expect(job).toContain("extends: .publish");
    expect(job).toContain("resource_group: publicar-fila");
    const rule = /rules:\n\s+- if: >-\n([\s\S]*?)\n {2}script:/.exec(job)?.[1] ?? "";
    expect(rule).toContain('$CI_PIPELINE_SOURCE == "schedule"');
    expect(rule).toContain("$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH");
    for (const name of ["PUBLISH_BUCKET", "PUBLISH_GITLAB_TOKEN", "GCP_WORKLOAD_IDENTITY_PROVIDER"]) expect(rule).toContain(`$${name}`);
    expect(job).toContain("!reference [.gcloud-login, script]");
  });

  it("hands the token of the GitLab to the script by stdin, and never by argument, so it stays out of the list of processes", () => {
    const job = rootBlocks().find(({ name }) => name === "publicar-pendentes")?.body ?? "";
    expect(job).toContain(`printf '%s' "$PUBLISH_GITLAB_TOKEN" | node scripts/publish-pending.ts`);
    expect(job).not.toMatch(/--token/);
    expect(job).not.toMatch(/PRIVATE-TOKEN/);
  });

  it("sends each object where the exit code of the script says: 0 to feitos/, 3 to falhas/, and any other stays in pending/", () => {
    const job = rootBlocks().find(({ name }) => name === "publicar-pendentes")?.body ?? "";
    expect(job).toContain('0) gcloud storage mv "$object" "$queue/feitos/$name"');
    expect(job).toContain('3) gcloud storage mv "$object" "$queue/falhas/$name"');
    expect(job).toContain("*) waiting=");
    expect(job).toContain('if [ "$waiting" -gt 0 ]');
  });
});
