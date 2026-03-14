import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

function generateCodeVerifier() {
  return crypto
    .randomBytes(32)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateCodeChallenge(verifier: string) {
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = crypto.randomBytes(16).toString('hex');

  const clientId = process.env.FACEIT_OAUTH_CLIENT_ID;
  const redirectUri = process.env.FACEIT_OAUTH_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  const authUrl = `https://accounts.faceit.com?${new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    redirect_popup: 'true', // Ensures proper pop-up handling
  }).toString()}`;

  // Set secure HttpOnly cookies (10 min expiry)
  const maxAge = 60 * 10;
  res.setHeader('Set-Cookie', [
    `code_verifier=${codeVerifier}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Path=/; Max-Age=${maxAge}`,
    `oauth_state=${state}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Path=/; Max-Age=${maxAge}`,
  ]);

  res.redirect(302, authUrl);
}