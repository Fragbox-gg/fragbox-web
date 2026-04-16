// lib/faceit/faceit-api.ts
import { EnrichedMatch, HistoryMatch, MatchDetails } from "./types";

const API_BASE = "https://open.faceit.com/data/v4";
const API_KEY = process.env.NEXT_PUBLIC_FACEIT_CLIENT_API_KEY;

if (!API_KEY) {
  console.warn("FACEIT API key is missing!");
}

export async function getPlayerFaction(matchId: string, playerId: string) {
  const res = await fetch(`${API_BASE}/matches/${matchId}`, {
    signal: AbortSignal.timeout(5000),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!res.ok) throw new Error(`Faceit API error: ${res.status}`);

  const data = await res.json();
  const f1 = (data.teams?.faction1?.roster || []).map((p: any) => p.player_id);
  const f2 = (data.teams?.faction2?.roster || []).map((p: any) => p.player_id);

  return { faction: f1.includes(playerId) ? 1 : f2.includes(playerId) ? 2 : 0 };
}

export async function getMatchStatus(matchId: string) {
  const res = await fetch(`${API_BASE}/matches/${matchId}`, {
    signal: AbortSignal.timeout(5000),
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  if (!res.ok) throw new Error(`Faceit API error: ${res.status}`);

  const data = await res.json();
  const statusStr = data.status || "UNKNOWN";

  let statusCode = 0;
  if (statusStr === "VOTING") statusCode = 1;
  else if (statusStr === "READY") statusCode = 2;
  else if (statusStr === "ONGOING") statusCode = 3;
  else if (statusStr === "FINISHED") statusCode = 4;

  let winnerCode = 0; // 0=unknown, 1=faction1, 2=faction2, 3=draw
  if (statusCode === 4 && data.results?.winner) {
    const w = data.results.winner;
    if (w === "faction1") winnerCode = 1;
    else if (w === "faction2") winnerCode = 2;
    else if (w === "draw") winnerCode = 3;
  }

  return { statusCode, winnerCode };
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
