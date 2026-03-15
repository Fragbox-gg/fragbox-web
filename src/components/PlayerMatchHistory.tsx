"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface FaceitUserInfoProps {
  faceitUser: { 
    guid?: string;
    picture?: string;
    email?: string;
    birthdate?: string;
    nickname?: string;
    locale?: string;
    iss?: string;
    sub?: string;
    aud?: string;
    exp?: number;
    iat?: number;
    given_name?: string;
    family_name?: string;
    email_verified?: boolean;
  } | null;
}

const API_BASE = 'https://open.faceit.com/data/v4';
const API_KEY = process.env.NEXT_PUBLIC_FACEIT_CLIENT_API_KEY

// Fallback map image
const FALLBACK_MAP_IMG = '/cs2-map-fallback.jpg';

// Player interface (from history)
interface Player {
  player_id: string;
  nickname: string;
  avatar: string;
  skill_level: number;
  game_player_id: string;
  game_player_name: string;
  faceit_url: string;
}

// Team interface (from history)
interface Team {
  team_id: string;
  nickname: string;
  avatar: string;
  type: string;
  players: Player[];
}

// History Match interface (based on provided JSON)
interface HistoryMatch {
  match_id: string;
  game_id: string;
  region: string;
  match_type: string;
  game_mode: string;
  max_players: number;
  teams_size: number;
  teams: {
    faction1: Team;
    faction2: Team;
  };
  playing_players: string[];
  competition_id: string;
  competition_name: string;
  competition_type: string;
  organizer_id: string;
  status: string;
  started_at: number;
  finished_at: number;
  results: {
    winner: 'faction1' | 'faction2';
    score: {
      faction1: number;
      faction2: number;
    };
  };
  faceit_url: string;
}

// Match Details interface (from previous, for map enrichment)
interface MatchDetails {
  match_id: string;
  status: string;
  teams: {
    faction1: Team; // Reuse history Team, but details may have more
    faction2: Team;
  };
  voting?: {
    map: {
      pick: string[]; // e.g. ["de_dust2"]
      entities: Array<{
        name: string;
        class_name: string;
        image_lg: string;
        image_sm: string;
      }>;
    };
  };
  results?: {
    score: {
      faction1: number;
      faction2: number;
    };
  };
  started_at?: number;
  finished_at?: number;
}

// Combined type for display (history + enriched map)
type EnrichedMatch = HistoryMatch & {
  mapName?: string;
  mapImage?: string;
};

export default function PlayerMatchHistory({ faceitUser }: FaceitUserInfoProps) {
  const [matches, setMatches] = useState<EnrichedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!faceitUser) {
      setError('No FACEIT user provided.');
      setLoading(false);
      return;
    }

    if (!faceitUser?.guid) {
      setError('No FACEIT user GUID provided.');
      setLoading(false);
      return;
    }

    async function fetchPlayerHistory() {
      try {
        // 1. Fetch player history (last 10 CS2 matches)
        const historyRes = await fetch(
          `${API_BASE}/players/${faceitUser?.guid}/history?game=cs2&limit=10`,
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${API_KEY}`,
            },
            next: { revalidate: 60 }, // Revalidate every minute
          }
        );

        if (!historyRes.ok) throw new Error(`Failed to fetch history: ${historyRes.status}`);

        const historyData = await historyRes.json();
        const historyMatches: HistoryMatch[] = historyData.items || [];

        // 2. Enrich each match with full details (for map and image)
        const enriched = await Promise.all(
          historyMatches.map(async (m) => {
            try {
              const detailRes = await fetch(`${API_BASE}/matches/${m.match_id}`, {
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${API_KEY}`,
                },
              });

              if (!detailRes.ok) {
                return { ...m, mapName: 'Unknown', mapImage: FALLBACK_MAP_IMG };
              }

              const detail: MatchDetails = await detailRes.json();

              // Extract map and image
              let mapName = 'Unknown';
              let mapImage = FALLBACK_MAP_IMG;
              if (detail.voting?.map?.pick?.[0]) {
                mapName = detail.voting.map.pick[0];
                const entity = detail.voting.map.entities.find(
                  (e) => e.class_name === mapName || e.name.toLowerCase() === mapName.toLowerCase()
                );
                mapImage = entity?.image_lg || entity?.image_sm || FALLBACK_MAP_IMG;
              }

              return { ...m, mapName, mapImage };
            } catch {
              return { ...m, mapName: 'Unknown', mapImage: FALLBACK_MAP_IMG };
            }
          })
        );

        setMatches(enriched);
      } catch (err: any) {
        setError(err.message || 'Failed to load match history');
      } finally {
        setLoading(false);
      }
    }

    fetchPlayerHistory();
  }, [faceitUser?.guid]);

  if (loading) return <div className="p-6 text-center text-xl">Loading match history...</div>;
  if (error) return <div className="p-6 text-center text-red-500 text-xl">Error: {error}</div>;
  if (matches.length === 0) return <div className="p-6 text-center text-xl">No recent matches found.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">
        {faceitUser?.nickname || 'Player'}&apos;s Recent CS2 Matches
      </h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => {
          const team1 = match.teams.faction1;
          const team2 = match.teams.faction2;
          const isFaction1Winner = match.results.winner === 'faction1';
          const score1 = match.results.score.faction1;
          const score2 = match.results.score.faction2;

          // Determine user's team (check if guid is in playing_players and match to team)
          const userPlayerId = faceitUser?.guid;
          const userInFaction1 = team1.players.some((p) => p.player_id === userPlayerId);
          const userTeam = userInFaction1 ? team1 : team2;
          const opponentTeam = userInFaction1 ? team2 : team1;
          const userScore = userInFaction1 ? score1 : score2;
          const opponentScore = userInFaction1 ? score2 : score1;
          const userWon = (userInFaction1 && isFaction1Winner) || (!userInFaction1 && !isFaction1Winner);

          return (
            <div
              key={match.match_id}
              className={`bg-gray-900 rounded-xl shadow-xl overflow-hidden border ${userWon ? 'border-green-500' : 'border-red-500'} hover:border-blue-500 transition-all`}
            >
              {/* Map banner */}
              <div className="relative h-40">
                <Image
                  src={match.mapImage || FALLBACK_MAP_IMG}
                  alt={match.mapName || 'Map'}
                  fill
                  className="object-cover brightness-75"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="text-2xl font-bold text-white drop-shadow-lg">
                    {match.mapName?.replace('de_', '').toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
              </div>

              {/* Teams & Score */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {userTeam.avatar && (
                        <Image
                          src={userTeam.avatar}
                          alt={userTeam.nickname}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                      <span className="font-semibold text-lg truncate">{userTeam.nickname || 'Your Team'}</span>
                    </div>
                  </div>

                  <div className="text-3xl font-bold mx-4">
                    {userScore} : {opponentScore}
                  </div>

                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="font-semibold text-lg truncate">{opponentTeam.nickname || 'Opponents'}</span>
                      {opponentTeam.avatar && (
                        <Image
                          src={opponentTeam.avatar}
                          alt={opponentTeam.nickname}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-400 mt-2">
                  {userWon ? 'Win' : 'Loss'} • {new Date(match.finished_at * 1000).toLocaleString()} • Match ID: {match.match_id.slice(0, 8)}...
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}