import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOidc } from "./oidc.ts";

const openid = vi.hoisted(() => ({
  discovery: vi.fn(),
  buildAuthorizationUrl: vi.fn(),
  calculatePKCECodeChallenge: vi.fn(),
  authorizationCodeGrant: vi.fn(),
  buildEndSessionUrl: vi.fn(),
}));
vi.mock("openid-client", () => openid);

const config = { name: "discovered configuration" };
const options = { tenantId: "tenant-id", clientId: "client-id", clientSecret: "client-secret", publicUrl: "https://portal.example.com" };
const attempt = { state: "state-value", nonce: "nonce-value", codeVerifier: "verifier-value" };

beforeEach(() => {
  vi.clearAllMocks();
  openid.discovery.mockResolvedValue(config);
  openid.calculatePKCECodeChallenge.mockResolvedValue("code-challenge");
  openid.buildAuthorizationUrl.mockReturnValue(new URL("https://login.example/authorize"));
  openid.buildEndSessionUrl.mockReturnValue(new URL("https://login.example/logout"));
});

describe("the Microsoft login", () => {
  it("discovers the single-tenant issuer as a confidential client", async () => {
    await createOidc(options);
    expect(openid.discovery).toHaveBeenCalledWith(new URL("https://login.microsoftonline.com/tenant-id/v2.0"), "client-id", "client-secret");
  });

  it("asks for an authorization code with PKCE S256, state and nonce", async () => {
    const oidc = await createOidc(options);
    expect(await oidc.authorizationUrl(attempt)).toBe("https://login.example/authorize");
    expect(openid.calculatePKCECodeChallenge).toHaveBeenCalledWith("verifier-value");
    expect(openid.buildAuthorizationUrl).toHaveBeenCalledWith(config, {
      redirect_uri: "https://portal.example.com/auth/callback",
      response_type: "code",
      scope: "openid profile email",
      code_challenge: "code-challenge",
      code_challenge_method: "S256",
      state: "state-value",
      nonce: "nonce-value",
    });
  });

  it("exchanges the code checking the PKCE verifier, the state, the nonce and the ID token", async () => {
    openid.authorizationCodeGrant.mockResolvedValue({ claims: () => ({ tid: "tenant-id", name: "Ana" }) });
    const oidc = await createOidc(options);
    const callback = new URL("https://portal.example.com/auth/callback?code=c&state=state-value");
    expect(await oidc.exchangeCode(callback, attempt)).toEqual({ tid: "tenant-id", name: "Ana" });
    expect(openid.authorizationCodeGrant).toHaveBeenCalledWith(config, callback, {
      pkceCodeVerifier: "verifier-value",
      expectedState: "state-value",
      expectedNonce: "nonce-value",
      idTokenExpected: true,
    });
  });

  it("fails when Microsoft returns no ID token", async () => {
    openid.authorizationCodeGrant.mockResolvedValue({ claims: () => undefined });
    const oidc = await createOidc(options);
    await expect(oidc.exchangeCode(new URL("https://portal.example.com/auth/callback"), attempt)).rejects.toThrow("ID token");
  });

  it("signs out of Microsoft and comes back to the portal", async () => {
    const oidc = await createOidc(options);
    expect(oidc.logoutUrl()).toBe("https://login.example/logout");
    expect(openid.buildEndSessionUrl).toHaveBeenCalledWith(config, { post_logout_redirect_uri: "https://portal.example.com/" });
  });
});
