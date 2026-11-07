import * as client from "openid-client";
import type { Claims, LoginAttempt, Oidc } from "./app.ts";

export async function createOidc(options: { tenantId: string; clientId: string; clientSecret: string; publicUrl: string }): Promise<Oidc> {
  const issuer = new URL(`https://login.microsoftonline.com/${options.tenantId}/v2.0`);
  const config = await client.discovery(issuer, options.clientId, options.clientSecret);
  const redirectUri = `${options.publicUrl}/auth/callback`;
  return {
    async authorizationUrl(attempt: LoginAttempt) {
      return client.buildAuthorizationUrl(config, {
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid profile email",
        code_challenge: await client.calculatePKCECodeChallenge(attempt.codeVerifier),
        code_challenge_method: "S256",
        state: attempt.state,
        nonce: attempt.nonce,
      }).href;
    },
    async exchangeCode(currentUrl: URL, attempt: LoginAttempt): Promise<Claims> {
      const tokens = await client.authorizationCodeGrant(config, currentUrl, {
        pkceCodeVerifier: attempt.codeVerifier,
        expectedState: attempt.state,
        expectedNonce: attempt.nonce,
        idTokenExpected: true,
      });
      const claims = tokens.claims();
      if (!claims) throw new Error("Microsoft did not return an ID token.");
      return { ...claims };
    },
    logoutUrl() {
      return client.buildEndSessionUrl(config, { post_logout_redirect_uri: `${options.publicUrl}/` }).href;
    },
  };
}
