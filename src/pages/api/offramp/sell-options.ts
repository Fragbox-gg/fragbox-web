// pages/api/offramp/sell-options.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const params = new URLSearchParams(req.url?.split("?")[1] || "");
  const resCoinbase = await fetch(
    `https://api.developer.coinbase.com/onramp/v1/sell/options?${params}`,
    {
      headers: { Authorization: `Bearer ${process.env.CDP_CLIENT_API_KEY_ID}` },
    },
  );

  const data = await resCoinbase.json();
  res.status(resCoinbase.status).json(data);
}
