import type { NextApiRequest, NextApiResponse } from "next";
import { Buffer } from "buffer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { code, state, error } = req.query;

  if (error) {
    console.error("Faceit OAuth error:", error);
    res.setHeader("Location", "/?error=faceit_auth_failed");
    res.status(302).end();
    return;
  }

  if (
    !code ||
    typeof code !== "string" ||
    !state ||
    typeof state !== "string"
  ) {
    res.status(400).json({ error: "Missing code or state" });
    return;
  }

  // Manual cookie parser (package-free)
  const getCookieValue = (name: string): string | null => {
    const cookieHeader = req.headers.cookie || "";
    const match = cookieHeader.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
    if (!match) return null;
    return decodeURIComponent(match[2]);
  };

  const storedState = getCookieValue("oauth_state");
  const codeVerifier = getCookieValue("code_verifier");

  if (!storedState || !codeVerifier || state !== storedState) {
    console.error("Invalid state or verifier");
    res.status(400).json({ error: "Invalid state or verifier" });
    return;
  }

  const clientId = process.env.FACEIT_OAUTH_CLIENT_ID;
  const clientSecret = process.env.FACEIT_OAUTH_SECRET;
  const redirectUri = process.env.FACEIT_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error("Missing Faceit OAuth environment variables");
    res.status(500).json({ error: "Server configuration error" });
    return;
  }

  const tokenUrl = "https://api.faceit.com/auth/v1/oauth/token";
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authHeader}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }).toString(),
  });

  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.json();
    console.error("Token exchange failed:", errorData);
    const errorHtml = `
      <html>
        <body>
          Error: Token exchange failed. Details: ${JSON.stringify(errorData)}
          <script>window.close();</script>
        </body>
      </html>
    `;
    res.setHeader("Content-Type", "text/html");
    res.status(500).send(errorHtml);
    return;
  }

  const tokenData = await tokenResponse.json();

  // Fetch user info (unchanged)
  const userInfoUrl = "https://api.faceit.com/auth/v1/resources/userinfo";
  const userResponse = await fetch(userInfoUrl, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  let userData: any = {};
  if (userResponse.ok) {
    userData = await userResponse.json();
  } else {
    console.warn("User info fetch failed, proceeding without it");
  }

  // Set access token cookie manually
  const isProd = process.env.NODE_ENV === "production";
  const accessTokenCookie = `faceit_access_token=${encodeURIComponent(tokenData.access_token)}; HttpOnly; Path=/; Max-Age=${tokenData.expires_in}; SameSite=Strict${isProd ? "; Secure" : ""}`;

  // Clear temp cookies manually
  const clearVerifier = `code_verifier=; HttpOnly; Path=/; Max-Age=0`;
  const clearState = `oauth_state=; HttpOnly; Path=/; Max-Age=0`;

  res.setHeader("Set-Cookie", [accessTokenCookie, clearVerifier, clearState]);

  const successHtml = `
    <html>
      <body>
        Authenticated successfully. Closing...
        <script>window.close();</script>
      </body>
    </html>
  `;
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(successHtml);
}
