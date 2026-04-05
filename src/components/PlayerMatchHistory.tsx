// components/PlayerMatchHistory.tsx
"use client";

import { useEffect, useState } from 'react';
import MatchHistoryList from './match/MatchHistoryList';
import { fetchPlayerRecentMatches } from '@/lib/faceit/faceit-api';
import { EnrichedMatch } from '@/lib/faceit/types';

interface FaceitUserInfoProps {
  faceitUser: {
    guid?: string;
    nickname?: string;
    // ... other fields
  } | null;
}

export default function PlayerMatchHistory({ faceitUser }: FaceitUserInfoProps) {
  const [matches, setMatches] = useState<EnrichedMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!faceitUser?.guid) {
      setError('No FACEIT user GUID provided.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadMatches() {
      try {
        setLoading(true);
        const data = await fetchPlayerRecentMatches(faceitUser?.guid!, 10);
        if (isMounted) setMatches(data);
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load match history');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMatches();

    return () => {
      isMounted = false;
    };
  }, [faceitUser?.guid]);

  if (loading) {
    return <div className="p-8 text-center text-xl">Loading match history...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-400 text-xl">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <MatchHistoryList
        matches={matches}
        userPlayerId={faceitUser?.guid!}
      />
    </div>
  );
}