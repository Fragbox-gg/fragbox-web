// pages/api/geo.ts
import type { NextApiRequest, NextApiResponse } from "next";

type GeoData = {
  countryCode: string | undefined;
  subdivision?: string;
};

// In-memory cache: IP → {data, expires}
const geoCache = new Map<string, { data: GeoData; expires: number }>();
const SUCCESS_CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours for good responses
const FAILURE_CACHE_TTL = 10 * 60 * 1000; // 10 minutes when API is down (so we retry soon)

function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"] as string | undefined;
  if (forwarded) return forwarded.split(",")[0].trim();
  return (req.socket.remoteAddress as string) || "unknown";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientIP = getClientIP(req);

  // CACHE HIT
  const cached = geoCache.get(clientIP);
  if (cached && cached.expires > Date.now()) {
    res.setHeader("Cache-Control", "public, max-age=14400");
    return res.status(200).json(cached.data);
  }

  try {
    const url =
      clientIP && clientIP !== "unknown" && clientIP !== "::1"
        ? `https://free.freeipapi.com/api/json/${encodeURIComponent(clientIP)}`
        : "https://free.freeipapi.com/api/json";

    const apiRes = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });

    if (!apiRes.ok) throw new Error(`API error: ${apiRes.status}`);

    const data = await apiRes.json();

    const countryCode = data.countryCode || undefined;
    const subdivision =
      countryCode === "US" && data.regionCode ? data.regionCode : undefined;

    const result: GeoData = { countryCode, subdivision };

    // Cache success for 4 hours
    geoCache.set(clientIP, {
      data: result,
      expires: Date.now() + SUCCESS_CACHE_TTL,
    });

    res.setHeader("Cache-Control", "public, max-age=14400");
    return res.status(200).json(result);
  } catch (error) {
    console.error("Geo lookup failed for IP", clientIP, error);

    const fallback: GeoData = {
      countryCode: undefined,
      subdivision: undefined,
    };

    // Cache the failure for only 10 minutes so we retry quickly when the API recovers
    geoCache.set(clientIP, {
      data: fallback,
      expires: Date.now() + FAILURE_CACHE_TTL,
    });

    res.setHeader("Cache-Control", "public, max-age=600");
    return res.status(200).json(fallback);
  }
}
