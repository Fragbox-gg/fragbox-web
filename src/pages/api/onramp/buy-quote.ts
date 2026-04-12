import type { NextApiRequest, NextApiResponse } from "next";
import {
  type FetchBuyQuote,
  type OnrampBuyQuoteSnakeCaseResponse,
} from "@coinbase/cdp-react";
import {
  generateCDPJWT,
  getCDPCredentials,
  ONRAMP_API_BASE_URL,
} from "@/lib/cdp-auth";
import { convertSnakeToCamelCase } from "@/lib/to-camel-case";

type OnrampBuyQuoteRequest = Parameters<FetchBuyQuote>[0];
type OnrampBuyQuoteResponseRaw = OnrampBuyQuoteSnakeCaseResponse;
type OnrampBuyQuoteResponse = Awaited<ReturnType<FetchBuyQuote>>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const body: OnrampBuyQuoteRequest = req.body;

    try {
      getCDPCredentials();
    } catch (_error) {
      return res
        .status(500)
        .json({ error: "CDP API credentials not configured" });
    }

    if (
      !body.purchaseCurrency ||
      !body.paymentAmount ||
      !body.paymentCurrency ||
      !body.paymentMethod ||
      !body.country
    ) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    if (body.country === "US" && !body.subdivision) {
      return res
        .status(400)
        .json({ error: "State/subdivision is required for US" });
    }

    const apiPath = "/onramp/v1/buy/quote";

    const jwt = await generateCDPJWT({
      requestMethod: "POST",
      requestHost: new URL(ONRAMP_API_BASE_URL).hostname,
      requestPath: apiPath,
    });

    const requestBody = {
      purchaseCurrency: body.purchaseCurrency,
      purchaseNetwork: body.purchaseNetwork,
      paymentAmount: body.paymentAmount,
      paymentCurrency: body.paymentCurrency,
      paymentMethod: body.paymentMethod,
      country: body.country,
      subdivision: body.subdivision,
      destinationAddress: body.destinationAddress,
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
      console.error("CDP API error:", response.statusText);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        return res
          .status(response.status)
          .json({ error: errorData.message || "Failed to create buy quote" });
      } catch {
        return res
          .status(response.status)
          .json({ error: "Failed to create buy quote" });
      }
    }

    const data: OnrampBuyQuoteResponseRaw = await response.json();
    const dataCamelCase: OnrampBuyQuoteResponse = convertSnakeToCamelCase(data);
    return res.status(200).json(dataCamelCase);
  } catch (error) {
    console.error("Error creating buy quote:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
