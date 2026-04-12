// pages/api/offramp/sell-quote.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const body = req.body;

  const response = await fetch(
    "https://api.developer.coinbase.com/onramp/v1/sell/quote",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CDP_CLIENT_API_KEY_ID}`,
      },
      body: JSON.stringify({
        cashoutCurrency: "USD",
        country: body.country,
        paymentMethod: body.paymentMethod || "ACH_BANK_ACCOUNT",
        sellCurrency: "USDC",
        sellAmount: body.sellAmount,
        sellNetwork: "base",
        sourceAddress: body.sourceAddress, // user's evmAddress
        partnerUserId: body.partnerUserId || "fragbox-user", // unique per user if you want
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/wallet?offramp=success`, // must be allowlisted in CDP dashboard
        ...body.extraParams,
      }),
    },
  );

  const data = await response.json();
  res.status(response.status).json(data);
}
