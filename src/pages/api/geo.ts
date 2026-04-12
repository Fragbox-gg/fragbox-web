// pages/api/geo.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Call the free HTTPS geo API (commercial use allowed)
    const apiRes = await fetch("https://free.freeipapi.com/api/json", {
      signal: AbortSignal.timeout(5000), // 5-second timeout
    });

    if (!apiRes.ok) {
      throw new Error(`External API returned ${apiRes.status}`);
    }

    const data = await apiRes.json();

    let countryCode: string | undefined = data.countryCode;
    let subdivision: string | undefined = undefined;

    // Coinbase only wants the 2-letter subdivision for US users
    if (countryCode === "US" && data.regionCode) {
      subdivision = data.regionCode; // e.g. "OH", "CA", "NY"
    }

    // Return clean, minimal payload
    return res.status(200).json({
      countryCode,
      subdivision,
    });
  } catch (error) {
    console.error("Geo lookup failed:", error);

    // Graceful fallback
    return res.status(200).json({
      countryCode: undefined,
      subdivision: undefined,
    });
  }
}
