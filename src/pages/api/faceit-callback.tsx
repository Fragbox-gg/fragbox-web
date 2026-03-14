import type { NextApiRequest, NextApiResponse } from 'next';
import { Buffer } from 'buffer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, error } = req.query;

  if (error) {
    console.error('Faceit OAuth error:', error);
    return res.redirect('/?error=faceit_auth_failed'); // Redirect to home with error query
  }

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  const clientId = process.env.FACEIT_OAUTH_CLIENT_ID;
  const clientSecret = process.env.FACEIT_OAUTH_SECRET;
  const redirectUri = process.env.FACEIT_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Missing Faceit OAuth environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Step 1: Exchange authorization code for tokens
  const tokenUrl = 'https://api.faceit.com/auth/v1/oauth/token'; // From Faceit OpenID config
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authHeader}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri, // Must match exactly what you registered
    }),
  });

  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.json();
    console.error('Token exchange failed:', errorData);
    return res.redirect('/?error=token_exchange_failed');
  }

  const tokenData = await tokenResponse.json();

  // Step 2: Fetch user info (optional but useful for getting Faceit ID)
  const userInfoUrl = 'https://api.faceit.com/auth/v1/resources/userinfo';
  const userResponse = await fetch(userInfoUrl, {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
    },
  });

  let userData: any = {};
  if (userResponse.ok) {
    userData = await userResponse.json();
    console.log('Faceit user info:', userData); // Debug: remove in production
  } else {
    console.warn('User info fetch failed, proceeding without it');
  }

  // For now, store the access token in a cookie (HttpOnly for security)
  // In production, use a proper session library like next-iron-session or NextAuth.js
  res.setHeader(
    'Set-Cookie',
    `faceit_access_token=${tokenData.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${tokenData.expires_in}`
  );

  // Optionally store refresh_token similarly if you plan to use it

  // Redirect to home (or a dashboard page) after success
  // You can pass userData.guid (Faceit ID) via query if needed, but better to fetch from session later
  res.redirect('/');
}