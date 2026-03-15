// components/match/MatchCard.tsx
import Image from 'next/image';
import { EnrichedMatch } from '@/lib/faceit/types';

interface MatchCardProps {
  match: EnrichedMatch;
  userPlayerId: string;
}

export default function MatchCard({ match, userPlayerId }: MatchCardProps) {
  const team1 = match.teams.faction1;
  const team2 = match.teams.faction2;

  const isFaction1Winner = match.results.winner === 'faction1';
  const score1 = match.results.score.faction1;
  const score2 = match.results.score.faction2;

  const userInFaction1 = team1.players.some((p) => p.player_id === userPlayerId);
  const userTeam = userInFaction1 ? team1 : team2;
  const opponentTeam = userInFaction1 ? team2 : team1;

  const userScore = userInFaction1 ? score1 : score2;
  const opponentScore = userInFaction1 ? score2 : score1;
  const userWon = (userInFaction1 && isFaction1Winner) || (!userInFaction1 && !isFaction1Winner);

  const timeStr = new Date(match.finished_at * 1000).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`
        bg-gray-900 rounded-xl shadow-xl overflow-hidden border 
        ${userWon ? 'border-green-600/70' : 'border-red-600/70'} 
        hover:border-blue-500/60 transition-all duration-200
        min-w-[320px] max-w-[380px] flex-shrink-0
      `}
    >
      {/* Map banner */}
      <div className="relative h-40">
        <Image
          src={match.mapImage || '/cs2-map-fallback.jpg'}
          alt={match.mapName || 'Map'}
          fill
          className="object-cover brightness-75"
          sizes="(max-width: 768px) 85vw, 340px"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="text-2xl font-bold text-white drop-shadow-lg tracking-wide">
            {match.mapName?.replace('de_', '').toUpperCase() || 'UNKNOWN'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          {/* Your team */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              {userTeam.avatar && (
                <Image
                  src={userTeam.avatar}
                  alt={userTeam.nickname}
                  width={44}
                  height={44}
                  className="rounded-full border border-gray-700/50"
                />
              )}
              <span className="font-semibold text-lg truncate">
                {userTeam.nickname.replace('team_', '') || 'Your Team'}
              </span>
            </div>
          </div>

          {/* Score */}
          <div className="text-3xl font-bold mx-5 text-white/90">
            {userScore} : {opponentScore}
          </div>

          {/* Opponent */}
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-3">
              <span className="font-semibold text-lg truncate">
                {opponentTeam.nickname.replace('team_', '') || 'Opponents'}
              </span>
              {opponentTeam.avatar && (
                <Image
                  src={opponentTeam.avatar}
                  alt={opponentTeam.nickname}
                  width={44}
                  height={44}
                  className="rounded-full border border-gray-700/50"
                />
              )}
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400 mt-1">
          {userWon ? 'Victory' : 'Defeat'} • {timeStr} • {match.match_id.slice(0, 8)}...
        </div>
      </div>
    </div>
  );
}