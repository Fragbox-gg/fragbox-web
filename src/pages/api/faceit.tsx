import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

export interface FaceitUserInfoProps {
  faceitUser: {
    guid?: string;
    picture?: string;
    email?: string;
    birthdate?: string;
    nickname?: string;
    locale?: string;
    iss?: string;
    sub?: string;
    aud?: string;
    exp?: number;
    iat?: number;
    given_name?: string;
    family_name?: string;
    email_verified?: boolean;
  } | null;
}

function generateCodeVerifier() {
  return crypto
    .randomBytes(32)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function generateCodeChallenge(verifier: string) {
  return crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = crypto.randomBytes(16).toString("hex");

  const clientId = process.env.FACEIT_OAUTH_CLIENT_ID;
  const redirectUri = process.env.FACEIT_OAUTH_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    res.status(500).json({ error: "Missing environment variables" });
    return;
  }

  const authUrl = `https://accounts.faceit.com?${new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid profile email",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    redirect_popup: "true",
  }).toString()}`;

  const maxAge = 60 * 10;
  const secureFlag = "; Secure"; // Force Secure for HTTPS (local/prod)

  // Manual Set-Cookie with SameSite=Lax
  const verifierCookie = `code_verifier=${encodeURIComponent(codeVerifier)}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secureFlag}`;
  const stateCookie = `oauth_state=${encodeURIComponent(state)}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secureFlag}`;

  res.setHeader("Set-Cookie", [verifierCookie, stateCookie]);

  res.setHeader("Location", authUrl);
  res.status(302).end();
}
