// pages/api/offramp/sell-quote.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  generateCDPJWT,
  getCDPCredentials,
  ONRAMP_API_BASE_URL,
} from "@/lib/cdp-auth";
import { convertSnakeToCamelCase } from "@/lib/to-camel-case";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const body = req.body;

    try {
      getCDPCredentials();
    } catch (_error) {
      return res
        .status(500)
        .json({ error: "CDP API credentials not configured" });
    }

    const apiPath = "/onramp/v1/sell/quote";

    const jwt = await generateCDPJWT({
      requestMethod: "POST",
      requestHost: new URL(ONRAMP_API_BASE_URL).hostname,
      requestPath: apiPath,
    });

    const requestBody = {
      cashoutCurrency: "USD",
      country: body.country,
      subdivision: body.subdivision,
      paymentMethod: "ACH_BANK_ACCOUNT",
      sellCurrency: "USDC",
      sellAmount: body.sellAmount?.toString(),
      sellNetwork: "base",
      sourceAddress: body.sourceAddress,
      partnerUserId:
        body.partnerUserId ||
        `fragbox-${body.sourceAddress?.slice(-12) || "user"}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/wallet?offramp=success`,
    };

    const response = await fetch(`${ONRAMP_API_BASE_URL}${apiPath}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("CDP Sell Quote API error:", response.statusText);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        return res
          .status(response.status)
          .json({ error: errorData.message || "Failed to create sell quote" });
      } catch {
        return res
          .status(response.status)
          .json({ error: errorText || "Failed to create sell quote" });
      }
    }

    const data = await response.json();
    const dataCamelCase = convertSnakeToCamelCase(data);
    return res.status(200).json(dataCamelCase);
  } catch (error) {
    console.error("Error creating sell quote:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
