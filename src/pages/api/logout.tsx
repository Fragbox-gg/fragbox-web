import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', 'faceit_access_token=; HttpOnly; Path=/; Max-Age=0');
  res.setHeader('Location', '/');
  res.status(302).end();
}