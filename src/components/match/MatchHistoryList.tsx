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
  title = "Recent Matches",
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
      {title && (
        <h2 className="text-2xl font-bold text-white px-2">{title}</h2>
      )}

      {/* Horizontal scroll */}
      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <div className="flex gap-6 px-2">
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