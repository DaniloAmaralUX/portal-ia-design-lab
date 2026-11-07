import { describe, expect, it } from "vitest";
import { ACERVO_CONTENT_SECURITY_POLICY, metaContentSecurityPolicy, serverContentSecurityPolicy } from "./content-security-policy";
import { sharepointOriginFrom } from "./sharepoint-origin";

function directives(policy: string) {
  return new Map(
    policy.split(";").map((d) => {
      const [name = "", ...values] = d.trim().split(/\s+/);
      return [name, values] as const;
    }),
  );
}

const SITE_POLICY = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:"],
  "font-src": ["'self'", "data:"],
  "connect-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'none'"],
  "form-action": ["'self'"],
};

describe("the portal's content security policy", () => {
  const fromBuild = directives(metaContentSecurityPolicy(null));
  const fromServer = directives(serverContentSecurityPolicy("abc123", null));

  it("has exactly the directives and sources the portal approved, so loosening any of them fails here", () => {
    expect(Object.fromEntries(fromBuild)).toEqual(SITE_POLICY);
    expect(Object.fromEntries(fromServer)).toEqual({ ...SITE_POLICY, "script-src": ["'self'", "'nonce-abc123'"], "frame-ancestors": ["'none'"] });
  });

  it("allows no other site, host or wildcard in any directive", () => {
    for (const policy of [fromBuild, fromServer]) {
      for (const [name, values] of policy) {
        for (const value of values) expect(value, `${name} ${value}`).toMatch(/^('self'|'none'|'unsafe-inline'|'nonce-[^']+'|data:)$/);
      }
    }
  });

  it("lets no <base> tag redirect the relative addresses of a page", () => {
    expect(fromBuild.get("base-uri")).toEqual(["'none'"]);
    expect(fromServer.get("base-uri")).toEqual(["'none'"]);
  });

  it("keeps the HTML and the scripts of a plugin file from running on the origin of the portal: sandboxed, with nothing allowed to load", () => {
    expect(ACERVO_CONTENT_SECURITY_POLICY).toBe("sandbox; default-src 'none'");
  });

  it("does not let JavaScript turn text into code", () => {
    expect(metaContentSecurityPolicy(null)).not.toContain("'unsafe-eval'");
    expect(serverContentSecurityPolicy("abc123", null)).not.toContain("'unsafe-eval'");
  });

  it("loads scripts only from the site itself", () => {
    expect(fromBuild.get("script-src")?.filter((v) => !v.startsWith("'"))).toEqual([]);
  });

  it("on the server, an inline script runs only with the page's nonce", () => {
    expect(fromServer.get("script-src")).toEqual(["'self'", "'nonce-abc123'"]);
  });

  it("connects only to the site itself, and embeds no iframe from anywhere else", () => {
    expect(fromBuild.get("connect-src")).toEqual(["'self'"]);
    expect(fromBuild.get("default-src")).toEqual(["'self'"]);
    expect(fromBuild.has("frame-src")).toBe(false);
  });

  it("locks down plugins, the base tag and form submissions to other sites", () => {
    for (const policy of [fromBuild, fromServer]) {
      expect(policy.get("object-src")).toEqual(["'none'"]);
      expect(policy.get("base-uri")).toEqual(["'none'"]);
      expect(policy.get("form-action")).toEqual(["'self'"]);
    }
  });

  it("on the server, no site can open the portal in an iframe", () => {
    expect(fromServer.get("frame-ancestors")).toEqual(["'none'"]);
  });
});

describe("the iframe of the recordings of the technical breaks", () => {
  const ORIGIN = "https://empresa.sharepoint.com";
  const fromBuild = directives(metaContentSecurityPolicy(ORIGIN));
  const fromServer = directives(serverContentSecurityPolicy("abc123", ORIGIN));

  it("adds only frame-src, with only the SharePoint origin, and leaves every other directive as it was", () => {
    expect(Object.fromEntries(fromBuild)).toEqual({ ...SITE_POLICY, "frame-src": [ORIGIN] });
    expect(Object.fromEntries(fromServer)).toEqual({
      ...SITE_POLICY,
      "frame-src": [ORIGIN],
      "script-src": ["'self'", "'nonce-abc123'"],
      "frame-ancestors": ["'none'"],
    });
  });

  it("takes only an https origin under sharepoint.com, so the variable cannot open the iframe to another site", () => {
    expect(sharepointOriginFrom("https://empresa.sharepoint.com/")).toBe(ORIGIN);
    for (const value of [
      "http://empresa.sharepoint.com",
      "https://sharepoint.com",
      "https://*.sharepoint.com",
      "https://empresa.sharepoint.com.evil.com",
      "https://evil.com/empresa.sharepoint.com",
      "https://empresa.sharepoint.com/sites/time",
      "https://empresa.sharepoint.com:8443",
      "https://user@empresa.sharepoint.com",
      "empresa.sharepoint.com",
    ]) {
      expect(() => sharepointOriginFrom(value), value).toThrow(/SHAREPOINT_ORIGIN/);
    }
  });
});
