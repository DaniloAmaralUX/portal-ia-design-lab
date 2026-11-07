import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const DEPLOY = path.resolve(import.meta.dirname, "../deploy");
const SERVICE_YAML = readFileSync(path.join(DEPLOY, "service.yaml"), "utf8");

// The test runs the real script, which needs envsubst (gettext). CI installs it, and there a missing envsubst fails the run.
const hasEnvsubst = spawnSync("envsubst", ["--version"]).status === 0;
const run = hasEnvsubst || process.env.CI ? it : it.skip;

const VALUES: Record<string, string> = {
  CLOUD_RUN_SERVICE: "portal-test",
  GCP_RUNTIME_SERVICE_ACCOUNT: "runtime@test-project.iam.gserviceaccount.test",
  IMAGE: "us-docker.pkg.dev/test-project/repo/portal-ia@sha256:0123456789abcdef",
  PORTAL_URL: "https://portal.example.test",
  MICROSOFT_TENANT_ID: "11111111-1111-4111-8111-111111111111",
  MICROSOFT_CLIENT_ID: "00000000-0000-0000-0000-000000000000",
  MICROSOFT_CLIENT_SECRET_NAME: "client-secret-test",
  MICROSOFT_CLIENT_SECRET_VERSION: "3",
  SESSION_SECRET_NAME: "session-secret-test",
  SESSION_SECRET_VERSION: "7",
};

function render(values: Record<string, string>) {
  const result = spawnSync("sh", [path.join(DEPLOY, "render-service.sh")], { env: { PATH: process.env.PATH ?? "", ...values }, encoding: "utf8" });
  // The envsubst of a Windows shell writes CRLF.
  return { out: result.stdout.replace(/\r\n/g, "\n"), err: result.stderr, status: result.status };
}

describe("deploy/service.yaml", () => {
  it("keeps no real value in the repository: every value is a placeholder, and the secrets are references", () => {
    for (const line of SERVICE_YAML.split("\n").filter((l) => /^\s*value:/.test(l))) expect(line).toMatch(/value: "\$\{[A-Z_]+\}"$/);
    expect(SERVICE_YAML).not.toMatch(/gserviceaccount|\.run\.app|sha256:[0-9a-f]{8}|gitlab\.pitang\.com/);
    for (const secret of ["MICROSOFT_CLIENT_SECRET", "SESSION_SECRET"]) {
      expect(SERVICE_YAML).toMatch(new RegExp(`- name: ${secret}\\n\\s+valueFrom:\\n\\s+secretKeyRef:`));
    }
  });

  run("renders with test values and leaves no placeholder behind", () => {
    const { out, err, status } = render(VALUES);
    expect(err).toBe("");
    expect(status).toBe(0);
    expect(out).not.toContain("${");
    for (const value of Object.values(VALUES)) expect(out).toContain(value);
  });

  run("has the two probes on /health at the port of the container, and the image by digest", () => {
    const { out } = render(VALUES);
    expect(out).toMatch(/startupProbe:\n\s+httpGet:\n\s+path: \/health\n\s+port: 8080/);
    expect(out).toMatch(/livenessProbe:\n\s+httpGet:\n\s+path: \/health\n\s+port: 8080/);
    expect(out).toMatch(/- containerPort: 8080/);
    expect(out).toMatch(/image: \S+@sha256:/);
    expect(out).toContain('run.googleapis.com/startup-cpu-boost: "true"');
  });

  run("reads the two secrets from Secret Manager at the pinned version, and never as text", () => {
    const { out } = render(VALUES);
    expect(out).toMatch(/- name: MICROSOFT_CLIENT_SECRET\n\s+valueFrom:\n\s+secretKeyRef:\n\s+name: client-secret-test\n\s+key: "3"/);
    expect(out).toMatch(/- name: SESSION_SECRET\n\s+valueFrom:\n\s+secretKeyRef:\n\s+name: session-secret-test\n\s+key: "7"/);
    expect(out).not.toMatch(/- name: (MICROSOFT_CLIENT_SECRET|SESSION_SECRET)\n\s+value:/);
  });

  run("falls back to 0 and 3 instances and the ingress of the load balancer, and drops SESSION_DURATION_HOURS, SHAREPOINT_ORIGIN, PUBLISHER_EMAILS and PUBLISH_BUCKET when they are not set", () => {
    const { out } = render(VALUES);
    expect(out).not.toContain("SHAREPOINT_ORIGIN");
    expect(out).not.toContain("PUBLISHER_EMAILS");
    expect(out).not.toContain("PUBLISH_BUCKET");
    expect(out).toContain('run.googleapis.com/minScale: "0"');
    expect(out).toContain('run.googleapis.com/maxScale: "3"');
    expect(out).toContain("run.googleapis.com/ingress: internal-and-cloud-load-balancing");
    expect(out).not.toContain("ingress: all");
    expect(out).not.toContain("SESSION_DURATION_HOURS");
    expect(out).toContain("- name: MICROSOFT_CLIENT_ID");
  });

  run("takes the optional variables when they are set", () => {
    const { out } = render({
      ...VALUES,
      CLOUD_RUN_MIN_INSTANCES: "1",
      CLOUD_RUN_MAX_INSTANCES: "5",
      CLOUD_RUN_INGRESS: "all",
      SESSION_DURATION_HOURS: "12",
      SHAREPOINT_ORIGIN: "https://empresa.sharepoint.com",
      PUBLISHER_EMAILS: "ana@pitang.com,bruno@pitang.com",
      PUBLISH_BUCKET: "portal-ia-publish",
    });
    expect(out).toMatch(/- name: PUBLISH_BUCKET\n\s+value: "portal-ia-publish"/);
    expect(out).toMatch(/- name: SHAREPOINT_ORIGIN\n\s+value: "https:\/\/empresa\.sharepoint\.com"/);
    expect(out).toMatch(/- name: PUBLISHER_EMAILS\n\s+value: "ana@pitang\.com,bruno@pitang\.com"/);
    expect(out).toContain('run.googleapis.com/minScale: "1"');
    expect(out).toContain('run.googleapis.com/maxScale: "5"');
    expect(out).toContain("run.googleapis.com/ingress: all");
    expect(out).toMatch(/- name: SESSION_DURATION_HOURS\n\s+value: "12"/);
    expect(out).not.toContain("${");
  });

  run("passes the bucket of the queue of /publicar to the service when it is set, and leaves no GitLab and no token in the file", () => {
    const { out: rendered } = render({ ...VALUES, PUBLISH_BUCKET: "portal-ia-publish", GITLAB_TOKEN: "glpat-left-in-gitlab", GITLAB_API_URL: "https://gitlab.example.test" });
    expect(rendered).toMatch(/- name: PUBLISH_BUCKET\n\s+value: "portal-ia-publish"/);
    expect(rendered).not.toContain("GITLAB_");
    expect(rendered).not.toContain("glpat-left-in-gitlab");
  });

  run.each(Object.keys(VALUES))("stops and names %s when it is missing", (name) => {
    const { [name]: _removed, ...rest } = VALUES;
    const { out, err, status } = render(rest);
    expect(status).toBe(1);
    expect(err).toContain(name);
    expect(out).toBe("");
  });
});
