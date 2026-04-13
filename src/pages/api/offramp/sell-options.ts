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
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    getCDPCredentials();

    const { country, subdivision, networks, cashoutCurrency } = req.query;

    // Build query params for Coinbase (only the ones they accept)
    const queryParams = new URLSearchParams();
    if (country) queryParams.append("country", country as string);
    if (subdivision) queryParams.append("subdivision", subdivision as string);
    if (networks) queryParams.append("networks", networks as string);
    // cashoutCurrency is NOT sent to Coinbase - we filter it ourselves below

    const queryString = queryParams.toString();
    const apiPath = "/onramp/v1/sell/options";
    const fullPath = apiPath + (queryString ? `?${queryString}` : "");

    const jwt = await generateCDPJWT({
      requestMethod: "GET",
      requestHost: new URL(ONRAMP_API_BASE_URL).hostname,
      requestPath: apiPath,
    });

    const response = await fetch(`${ONRAMP_API_BASE_URL}${fullPath}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("CDP Sell Options error:", errorText);
      return res
        .status(response.status)
        .json({ error: "Failed to fetch sell options from Coinbase" });
    }

    let data = await response.json();
    data = convertSnakeToCamelCase(data);

    // ONLY RETURN PAYMENT METHODS
    const targetCashoutCurrency = (
      (cashoutCurrency as string) || "USD"
    ).toUpperCase();

    const cashoutEntry = data.cashoutCurrencies?.find(
      (c: any) => c.id === targetCashoutCurrency,
    );

    const paymentMethods: string[] =
      cashoutEntry?.limits?.map((limit: any) => limit) || [];

    // Clean response - exactly what the frontend needs
    return res.status(200).json({ paymentMethods });
  } catch (error) {
    console.error("Error fetching sell options:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
