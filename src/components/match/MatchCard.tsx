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

  // Decide which is "left" (user's team) and which is "right"
  const leftTeam  = userInFaction1 ? team1 : team2;
  const rightTeam = userInFaction1 ? team2 : team1;

  const leftScore  = userInFaction1 ? score1 : score2;
  const rightScore = userInFaction1 ? score2 : score1;

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
        min-w-[340px] max-w-[340px] flex-shrink-0
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

      {/* Teams + Score row */}
      <div className="p-5 pb-3">
      <div className="flex items-center justify-center gap-10">

        {/* Left avatar */}
        <div className="flex flex-col items-center">
          {leftTeam.avatar ? (
            <Image
              src={leftTeam.avatar}
              alt={leftTeam.nickname}
              width={64}
              height={64}
              className="rounded-full border-2 border-gray-700/60 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-bold">
              ?
            </div>
          )}
        </div>

        {/* Centered score – this is now rock-solid center */}
        <div className="text-3xl font-black text-white tracking-tighter drop-shadow-md">
          {leftScore} : {rightScore}
        </div>

        {/* Right avatar */}
        <div className="flex flex-col items-center">
          {rightTeam.avatar ? (
            <Image
              src={rightTeam.avatar}
              alt={rightTeam.nickname}
              width={64}
              height={64}
              className="rounded-full border-2 border-gray-700/60 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-bold">
              ?
            </div>
          )}
        </div>

      </div>

      {/* Team names – below, centered under avatars */}
      <div className="flex justify-between mt-4 px-2 sm:px-8 md:px-12 text-sm sm:text-base">
        <div className="max-w-[45%] text-center">
          <div className="font-semibold text-gray-200 truncate">
            {leftTeam.nickname.replace('team_', '') || 'Your Team'}
          </div>
        </div>
        <div className="max-w-[45%] text-center">
          <div className="font-semibold text-gray-200 truncate">
            {rightTeam.nickname.replace('team_', '') || 'Opponents'}
          </div>
        </div>
      </div>
    </div>

    {/* Result line */}
    <div className="text-center text-sm text-gray-400 pb-5 pt-2 border-t border-gray-800/50">
      {userWon ? 'Victory' : 'Defeat'} • {timeStr}
    </div>
    </div>
  );
}