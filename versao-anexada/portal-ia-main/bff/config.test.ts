import { describe, expect, it } from "vitest";
import { readConfig } from "./config.ts";

const valid = {
  PORTAL_URL: "https://portal.example.com",
  MICROSOFT_TENANT_ID: "00000000-0000-4000-8000-000000000002",
  MICROSOFT_CLIENT_ID: "00000000-0000-0000-0000-000000000001",
  MICROSOFT_CLIENT_SECRET: "client-secret",
  SESSION_SECRET: "s".repeat(48),
};

describe("the configuration", () => {
  it("reads the required variables and defaults the optional ones", () => {
    expect(readConfig(valid)).toEqual({
      publicUrl: "https://portal.example.com",
      tenantId: valid.MICROSOFT_TENANT_ID,
      clientId: valid.MICROSOFT_CLIENT_ID,
      clientSecret: "client-secret",
      sessionPasswords: { 1: valid.SESSION_SECRET },
      sessionDurationHours: 8,
      port: 8080,
      sharepointOrigin: null,
      publisherEmails: [],
      publishBucket: null,
    });
  });

  it("takes the people who publish as e-mails separated by commas, in lower case and without repeats", () => {
    expect(readConfig({ ...valid, PUBLISHER_EMAILS: " Ana.Souza@pitang.com, bruno@pitang.com,ana.souza@pitang.com " }).publisherEmails).toEqual([
      "ana.souza@pitang.com",
      "bruno@pitang.com",
    ]);
    expect(() => readConfig({ ...valid, PUBLISHER_EMAILS: "ana.souza@pitang.com,,bruno@pitang.com" })).toThrow("PUBLISHER_EMAILS");
    expect(() => readConfig({ ...valid, PUBLISHER_EMAILS: "ana.souza" })).toThrow("PUBLISHER_EMAILS");
  });

  it("takes the SharePoint origin of the recordings only as an https origin under sharepoint.com", () => {
    expect(readConfig({ ...valid, SHAREPOINT_ORIGIN: "https://empresa.sharepoint.com/" }).sharepointOrigin).toBe("https://empresa.sharepoint.com");
    expect(() => readConfig({ ...valid, SHAREPOINT_ORIGIN: "https://evil.example.com" })).toThrow("SHAREPOINT_ORIGIN");
  });

  it.each(["PORTAL_URL", "MICROSOFT_TENANT_ID", "MICROSOFT_CLIENT_ID", "MICROSOFT_CLIENT_SECRET", "SESSION_SECRET"])("refuses to start without %s", (name) => {
    expect(() => readConfig({ ...valid, [name]: " " })).toThrow(name);
  });

  it("accepts http only on localhost, and only an origin", () => {
    expect(readConfig({ ...valid, PORTAL_URL: "http://localhost:8080/" }).publicUrl).toBe("http://localhost:8080");
    expect(() => readConfig({ ...valid, PORTAL_URL: "http://portal.example.com" })).toThrow("https");
    expect(() => readConfig({ ...valid, PORTAL_URL: "portal.example.com" })).toThrow("absolute URL");
    expect(() => readConfig({ ...valid, PORTAL_URL: "https://portal.example.com/portal" })).toThrow("without a path");
  });

  it("reads numbered session secrets for rotation, and refuses a short one or a repeated number", () => {
    const next = "n".repeat(40);
    expect(readConfig({ ...valid, SESSION_SECRET: `2:${next}, 1:${valid.SESSION_SECRET}` }).sessionPasswords).toEqual({ 1: valid.SESSION_SECRET, 2: next });
    expect(() => readConfig({ ...valid, SESSION_SECRET: `2:short,1:${valid.SESSION_SECRET}` })).toThrow("key 2");
    expect(() => readConfig({ ...valid, SESSION_SECRET: `1:${next},1:${valid.SESSION_SECRET}` })).toThrow("repeats");
    expect(readConfig({ ...valid, SESSION_SECRET: `a:b,${"x".repeat(40)}` }).sessionPasswords).toEqual({ 1: `a:b,${"x".repeat(40)}` });
  });

  it("accepts the tenant as a GUID, in any case", () => {
    const tenant = "AAAAAAAA-BBBB-4CCC-8DDD-EEEEEEEEEEEE";
    expect(readConfig({ ...valid, MICROSOFT_TENANT_ID: tenant }).tenantId).toBe(tenant.toLowerCase());
  });

  it.each(["portal-ia", "aaaaaaaa", "not a guid", "00000000-0000-0000-0000-00000000000g"])("refuses the tenant %j, which is not a GUID", (value) => {
    expect(() => readConfig({ ...valid, MICROSOFT_TENANT_ID: value })).toThrow(/MICROSOFT_TENANT_ID.*GUID/);
  });

  it.each(["common", "organizations", "consumers", "Common", "ORGANIZATIONS"])("refuses the multi-tenant value %s, because only Pitang may sign in", (value) => {
    expect(() => readConfig({ ...valid, MICROSOFT_TENANT_ID: value })).toThrow(/MICROSOFT_TENANT_ID.*only Pitang/);
  });

  it("refuses a short session secret and a client ID that is not a GUID", () => {
    expect(() => readConfig({ ...valid, SESSION_SECRET: "short" })).toThrow("at least 32");
    expect(() => readConfig({ ...valid, MICROSOFT_CLIENT_ID: "portal-ia" })).toThrow("GUID");
  });

  it.each([
    ["SESSION_DURATION_HOURS", "0"],
    ["SESSION_DURATION_HOURS", "abc"],
    ["SESSION_DURATION_HOURS", "48"],
    ["PORT", "8080.5"],
    ["PORT", "70000"],
  ])("refuses %s=%s", (name, value) => {
    expect(() => readConfig({ ...valid, [name]: value })).toThrow(name);
  });

  it("reads valid optional values", () => {
    expect(readConfig({ ...valid, SESSION_DURATION_HOURS: "4", PORT: "3000" })).toMatchObject({ sessionDurationHours: 4, port: 3000 });
  });
});

describe("the bucket of the queue of /publicar", () => {
  it("is off without the variable, and takes the name of a bucket", () => {
    expect(readConfig(valid).publishBucket).toBeNull();
    expect(readConfig({ ...valid, PUBLISH_BUCKET: " portal-ia-publish " }).publishBucket).toBe("portal-ia-publish");
    expect(readConfig({ ...valid, PUBLISH_BUCKET: "bucket.with_dots-and-dashes" }).publishBucket).toBe("bucket.with_dots-and-dashes");
  });

  it("refuses what is not the name of a bucket, naming PUBLISH_BUCKET", () => {
    for (const bucket of ["ab", "Portal", "-portal", "portal-", "gs://portal-ia", "portal/ia", "portal ia", "a".repeat(64)]) {
      expect(() => readConfig({ ...valid, PUBLISH_BUCKET: bucket })).toThrow("PUBLISH_BUCKET");
    }
  });

  it("no longer reads the GitLab: the token stays out of the environment of the portal", () => {
    const config = readConfig({ ...valid, GITLAB_API_URL: "https://gitlab.example.com", GITLAB_PROJECT_ID: "1", GITLAB_TOKEN: "glpat-secret" });
    expect(JSON.stringify(config)).not.toContain("glpat-secret");
    expect(Object.keys(config)).not.toContain("gitlab");
  });
});
