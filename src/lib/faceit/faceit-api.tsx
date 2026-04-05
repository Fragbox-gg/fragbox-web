// lib/faceit/faceit-api.ts
import { EnrichedMatch, HistoryMatch, MatchDetails } from "./types";

const API_BASE = "https://open.faceit.com/data/v4";
const API_KEY = process.env.NEXT_PUBLIC_FACEIT_CLIENT_API_KEY;

if (!API_KEY) {
  console.warn("FACEIT API key is missing!");
}

export async function fetchPlayerRecentMatches(
  playerId: string,
  limit = 10,
): Promise<EnrichedMatch[]> {
  if (!playerId) throw new Error("Player ID is required");

  // 1. Get match history
  const historyRes = await fetch(
    `${API_BASE}/players/${playerId}/history?game=cs2&limit=${limit}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      next: { revalidate: 60 },
    },
  );

  if (!historyRes.ok) {
    throw new Error(`History fetch failed: ${historyRes.status}`);
  }

  const historyData = await historyRes.json();
  const matches: HistoryMatch[] = historyData.items || [];

  // 2. Enrich with match details (map mostly)
  const enriched = await Promise.all(
    matches.map(async (match) => {
      try {
        const detailRes = await fetch(`${API_BASE}/matches/${match.match_id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        if (!detailRes.ok) {
          return enrichWithFallback(match);
        }

        const detail: MatchDetails = await detailRes.json();
        return enrichMatchWithMap(match, detail);
      } catch {
        return enrichWithFallback(match);
      }
    }),
  );

  return enriched;
}

function enrichWithFallback(match: HistoryMatch): EnrichedMatch {
  return {
    ...match,
    mapName: "Unknown",
    mapImage: "/cs2-map-fallback.jpg",
  };
}

function enrichMatchWithMap(
  match: HistoryMatch,
  detail: MatchDetails,
): EnrichedMatch {
  let mapName = "Unknown";
  let mapImage = "/cs2-map-fallback.jpg";

  if (detail.voting?.map?.pick?.[0]) {
    mapName = detail.voting.map.pick[0];
    const entity = detail.voting.map.entities.find(
      (e) =>
        e.class_name === mapName ||
        e.name.toLowerCase() === mapName.toLowerCase(),
    );
    mapImage = entity?.image_lg || entity?.image_sm || mapImage;
  }

  return {
    ...match,
    mapName,
    mapImage,
  };
}
