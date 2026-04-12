import type { NextApiRequest, NextApiResponse } from "next";
import {
  type FetchBuyOptions,
  type OnrampBuyOptionsSnakeCaseResponse,
} from "@coinbase/cdp-react";
import {
  generateCDPJWT,
  getCDPCredentials,
  ONRAMP_API_BASE_URL,
} from "@/lib/cdp-auth";
import { convertSnakeToCamelCase } from "@/lib/to-camel-case";

type OnrampBuyOptionsResponseRaw = OnrampBuyOptionsSnakeCaseResponse;
type OnrampBuyOptionsResponse = Awaited<ReturnType<FetchBuyOptions>>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    try {
      getCDPCredentials();
    } catch (_error) {
      return res
        .status(500)
        .json({ error: "CDP API credentials not configured" });
    }

    const { country, subdivision, networks } = req.query;

    const queryParams = new URLSearchParams();
    if (country) queryParams.append("country", country as string);
    if (subdivision) queryParams.append("subdivision", subdivision as string);
    if (networks) queryParams.append("networks", networks as string);

    const queryString = queryParams.toString();
    const apiPath = "/onramp/v1/buy/options";
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
      console.error("CDP API error:", response.statusText);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        return res
          .status(response.status)
          .json({ error: errorData.message || "Failed to fetch buy options" });
      } catch {
        return res
          .status(response.status)
          .json({ error: "Failed to fetch buy options" });
      }
    }

    const data: OnrampBuyOptionsResponseRaw = await response.json();
    const dataCamelCase: OnrampBuyOptionsResponse =
      convertSnakeToCamelCase(data);
    return res.status(200).json(dataCamelCase);
  } catch (error) {
    console.error("Error fetching buy options:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
