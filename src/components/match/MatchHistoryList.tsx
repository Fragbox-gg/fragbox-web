// components/match/MatchHistoryList.tsx
import MatchCard from './MatchCard';
import { EnrichedMatch } from '@/lib/faceit/types';

interface MatchHistoryListProps {
  matches: EnrichedMatch[];
  userPlayerId: string;
  title?: string;
}

export default function MatchHistoryList({
  matches,
  userPlayerId,
}: MatchHistoryListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No recent matches found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Horizontal scroll – modern subtle style */}
      <div
        className={`
          overflow-x-auto pb-6
          scrollbar-gutter-stable               // prevents layout shift (modern browsers)
          [&::-webkit-scrollbar]:h-3            // very thin
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-neutral-600/40
          [&::-webkit-scrollbar-thumb]:rounded-xl
          [&::-webkit-scrollbar-thumb]:transition-all
          [&::-webkit-scrollbar-thumb]:duration-200
          hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500/70
          active:[&::-webkit-scrollbar-thumb]:bg-sky-600/80
          [&::-webkit-scrollbar-corner]:bg-transparent
        `}
      >
        <div className="flex gap-6 px-2 min-w-max">
          {matches.map((match) => (
            <MatchCard
              key={match.match_id}
              match={match}
              userPlayerId={userPlayerId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}