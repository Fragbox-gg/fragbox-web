import type { NextApiRequest, NextApiResponse } from 'next';
import { Buffer } from 'buffer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, state, error } = req.query;

  if (error) {
    console.error('Faceit OAuth error:', error);
    return res.redirect('/?error=faceit_auth_failed');
  }

  if (!code || typeof code !== 'string' || !state || typeof state !== 'string') {
    return res.status(400).json({ error: 'Missing code or state' });
  }

  // Retrieve from cookies
  const cookies = req.headers.cookie?.split('; ').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>) || {};

  const storedState = cookies.oauth_state;
  const codeVerifier = cookies.code_verifier;

  if (!storedState || !codeVerifier || state !== storedState) {
    console.error('Invalid state or verifier');
    return res.status(400).json({ error: 'Invalid state or verifier' });
  }

  const clientId = process.env.FACEIT_OAUTH_CLIENT_ID;
  const clientSecret = process.env.FACEIT_OAUTH_SECRET; // Note: Env var name had 'OAUTH' not 'FACEIT_OAUTH'—fix if needed
  const redirectUri = process.env.FACEIT_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Missing Faceit OAuth environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Token exchange with PKCE
  const tokenUrl = 'https://api.faceit.com/auth/v1/oauth/token';
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
      redirect_uri: redirectUri,
      code_verifier: codeVerifier, // Critical addition
    }),
  });

  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.json();
    console.error('Token exchange failed:', errorData);
    // For pop-up, return HTML error
    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(`
      <html><body>Error: Token exchange failed. Details: ${JSON.stringify(errorData)}<script>window.close();</script></body></html>
    `);
    return;
  }

  const tokenData = await tokenResponse.json();

  // Fetch user info (unchanged)
  const userInfoUrl = 'https://api.faceit.com/auth/v1/resources/userinfo';
  const userResponse = await fetch(userInfoUrl, {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
    },
  });

  let userData: any = {};
  if (userResponse.ok) {
    userData = await userResponse.json();
    console.log('Faceit user info:', userData);
  } else {
    console.warn('User info fetch failed, proceeding without it');
  }

  // Store access token in cookie (unchanged)
  res.setHeader(
    'Set-Cookie',
    `faceit_access_token=${tokenData.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${tokenData.expires_in}`
  );

  // Clear temp cookies
  res.setHeader('Set-Cookie', [
    ...res.getHeader('Set-Cookie') as string[] || [],
    'code_verifier=; HttpOnly; Max-Age=0; Path=/',
    'oauth_state=; HttpOnly; Max-Age=0; Path=/',
  ]);

  // For pop-up, close window
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <html><body>Authenticated successfully. Closing...<script>window.close();</script></body></html>
  `);
}