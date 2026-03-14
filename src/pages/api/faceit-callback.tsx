import type { NextApiRequest, NextApiResponse } from 'next';
import { Buffer } from 'buffer'; // Node.js Buffer for Base64

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({ error: `Faceit error: ${error}` });
  }

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  const clientId = process.env.FACEIT_CLIENT_ID;
  const clientSecret = process.env.FACEIT_CLIENT_SECRET;
  const redirectUri = 'https://www.fragbox.gg/api/faceit-callback'; // Must match your Faceit client config

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Missing Faceit client credentials' });
  }

  // Exchange code for tokens
  const tokenUrl = 'https://api.faceit.com/auth/v1/oauth/token';
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code as string,
  });

  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body,
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    return res.status(500).json({ error: 'Token exchange failed', details: tokenData });
  }

  // Fetch user info using access token (e.g., to get Faceit ID)
  const userInfoUrl = 'https://api.faceit.com/auth/v1/resources/userinfo';
  const userResponse = await fetch(userInfoUrl, {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
    },
  });

  const userData = await userResponse.json();

  if (!userResponse.ok) {
    return res.status(500).json({ error: 'User info fetch failed', details: userData });
  }

  // userData should include fields like guid (Faceit user ID), email, etc., based on scopes
  console.log('User info:', userData); // For debugging; remove in prod

  // Set a secure cookie with the access token (expand to full session management)
  res.setHeader('Set-Cookie', `faceit_token=${tokenData.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${tokenData.expires_in}`);

  // Redirect to home page after successful auth
  res.redirect('/');
}