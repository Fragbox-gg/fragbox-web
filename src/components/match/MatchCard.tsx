// components/match/MatchCard.tsx
import Image from "next/image";
import { EnrichedMatch } from "@/lib/faceit/types";
import {
  useFragboxActions,
  useGetMatchBet,
  useHasPlacedBet,
} from "@/hooks/useFragboxActions";

interface MatchCardProps {
  match: EnrichedMatch;
  userPlayerId: string;
}

export default function MatchCard({ match, userPlayerId }: MatchCardProps) {
  const team1 = match.teams.faction1;
  const team2 = match.teams.faction2;

  const isFaction1Winner = match.results.winner === "faction1";
  const score1 = match.results.score.faction1;
  const score2 = match.results.score.faction2;

  const userInFaction1 = team1.players.some(
    (p) => p.player_id === userPlayerId,
  );

  const leftTeam = userInFaction1 ? team1 : team2;
  const rightTeam = userInFaction1 ? team2 : team1;

  const leftScore = userInFaction1 ? score1 : score2;
  const rightScore = userInFaction1 ? score2 : score1;

  const userWon =
    (userInFaction1 && isFaction1Winner) ||
    (!userInFaction1 && !isFaction1Winner);

  const timeStr = new Date(match.finished_at * 1000).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const { claim, emergencyRefund, isPending } = useFragboxActions();
  const { data: matchOnChain } = useGetMatchBet(match.match_id);

  // Only show claim/refund if they actually placed a bet
  const hasPlacedBet = useHasPlacedBet(match.match_id, userPlayerId);

  const matchStartBlockTimestamp = matchOnChain?.matchStartTimestamp as
    | number
    | undefined;
  const matchStatus = matchOnChain?.matchStatus as number | undefined;
  const factionTotals = matchOnChain?.factionTotals as bigint[] | undefined;

  let isClaimEligible = matchStatus === 4 || matchStatus === 5; // Not invalid, and is finished or invalid

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const EMERGENCY_REFUND_TIMEOUT = 14400; // 4 hours in seconds
  const isEmergencyEligible =
    !isClaimEligible &&
    !!matchStartBlockTimestamp && // guard against undefined
    matchStartBlockTimestamp > 0n && // sometimes it's 0 (not started yet)
    nowInSeconds > Number(matchStartBlockTimestamp) + EMERGENCY_REFUND_TIMEOUT;

  // Hide Claim for losers with no excess
  let canClaim = false;
  if (hasPlacedBet && isClaimEligible && factionTotals) {
    const winnerFaction = matchOnChain?.winnerFaction as number | undefined;
    const userFactionIndex = userInFaction1 ? 1 : 2;

    // Draw / Invalid / no winning bets → always claimable (full refund)
    if (
      winnerFaction === 3 || // Draw
      winnerFaction === 0 || // Unknown (shouldn't happen)
      (winnerFaction === 1 && factionTotals[1] === 0n) ||
      (winnerFaction === 2 && factionTotals[2] === 0n)
    ) {
      canClaim = true;
    } else if (userFactionIndex === winnerFaction) {
      // Winner side -> always claimable
      canClaim = true;
    } else {
      // Loser side -> only if losing side overbet (excess exists)
      const winningTotal =
        winnerFaction === 1 ? factionTotals[1] : factionTotals[2];
      const losingTotal =
        winnerFaction === 1 ? factionTotals[2] : factionTotals[1];

      canClaim = losingTotal > winningTotal;
    }
  }

  isClaimEligible = isClaimEligible && canClaim;

  const handleAction = () => {
    if (isClaimEligible) {
      claim(match.match_id, userPlayerId);
    } else if (isEmergencyEligible) {
      emergencyRefund(match.match_id, userPlayerId);
    }
  };

  const showButton = hasPlacedBet && (isClaimEligible || isEmergencyEligible);

  return (
    <div
      className={`
        bg-gray-900 rounded-xl shadow-xl overflow-hidden border 
        ${userWon ? "border-green-600/70" : "border-red-600/70"} 
        hover:border-blue-500/60 transition-all duration-200
        min-w-[340px] max-w-[340px] flex-shrink-0
      `}
    >
      <a
        href={`https://www.faceit.com/en/cs2/room/${match.match_id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* Map banner */}
        <div className="relative h-40">
          <Image
            src={match.mapImage || "/cs2-map-fallback.jpg"}
            alt={match.mapName || "Map"}
            fill
            className="object-cover brightness-75"
            sizes="(max-width: 768px) 85vw, 340px"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-2xl font-bold text-white drop-shadow-lg tracking-wide">
              {match.mapName?.replace("de_", "").toUpperCase() || "UNKNOWN"}
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="pt-4 pb-4">
          <div className="flex items-start justify-between">
            {/* Left team – avatar + name below */}
            <div className="flex flex-col items-center w-[42%]">
              {leftTeam.avatar ? (
                <Image
                  src={leftTeam.avatar}
                  alt={leftTeam.nickname}
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-gray-700/60 shadow-md mb-2"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-bold mb-2">
                  ?
                </div>
              )}
              <div className="text-center">
                <div className="font-semibold text-base leading-tight truncate max-w-full">
                  {leftTeam.nickname || "Your Team"}
                </div>
              </div>
            </div>

            {/* Centered score + "No bets" label */}
            <div className="flex flex-col items-center shrink-0 pt-2">
              <div className="text-3xl font-black text-white tracking-tighter drop-shadow-md whitespace-nowrap">
                {leftScore} : {rightScore}
              </div>
              <div className="text-sm text-gray-400 font-medium mt-1">
                No bets
              </div>
            </div>

            {/* Right team – avatar + name below */}
            <div className="flex flex-col items-center w-[42%]">
              {rightTeam.avatar ? (
                <Image
                  src={rightTeam.avatar}
                  alt={rightTeam.nickname}
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-gray-700/60 shadow-md mb-2"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-bold mb-2">
                  ?
                </div>
              )}
              <div className="text-center">
                <div className="font-semibold text-base leading-tight truncate max-w-full">
                  {rightTeam.nickname || "Opponents"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Result & time */}
        <div className="text-center text-sm text-gray-400 pb-5 pt-2 border-t border-gray-800/50 mx-6">
          {userWon ? "Victory" : "Defeat"} • {timeStr}
        </div>
      </a>

      {showButton && (
        <button
          onClick={handleAction}
          disabled={isPending}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {isPending
            ? "Processing..."
            : isEmergencyEligible
              ? "Get Refund"
              : "Claim Winnings"}
        </button>
      )}
    </div>
  );
}
