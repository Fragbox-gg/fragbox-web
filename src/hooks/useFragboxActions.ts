import { useReadContract, useWriteContract } from "wagmi";
import { fragBoxBettingAbi } from "@/constants/abi";
import { fragboxBettingContractAddress } from "@/wagmi";
import { keccak256, stringToBytes } from "viem";
import { useCallback, useMemo } from "react";

// ───── Pure utility (no hook needed) ─────
const getPlayerKey = (playerId: string) => keccak256(stringToBytes(playerId));

// ───── READ HOOKS (these must be called at the top level) ─────
export function useGetWinnings(playerId?: string) {
  const playerKey = useMemo(
    () => (playerId ? getPlayerKey(playerId) : undefined),
    [playerId],
  );

  return useReadContract({
    address: fragboxBettingContractAddress,
    abi: fragBoxBettingAbi,
    functionName: "getWinnings",
    args: playerKey ? [playerKey] : undefined,
    query: { enabled: !!playerId },
  });
}

export function useGetMatchBet(matchId?: string) {
  const matchKey = useMemo(
    () => (matchId ? keccak256(stringToBytes(matchId)) : undefined),
    [matchId],
  );

  return useReadContract({
    address: fragboxBettingContractAddress,
    abi: fragBoxBettingAbi,
    functionName: "getMatchBet",
    args: matchKey ? [matchKey] : undefined,
    query: { enabled: !!matchId },
  });
}

// ───── WRITE ACTIONS (only this hook now) ─────
export function useFragboxActions() {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const claim = useCallback(
    (matchId: string, playerId: string) => {
      writeContract({
        address: fragboxBettingContractAddress,
        abi: fragBoxBettingAbi,
        functionName: "claim",
        args: [matchId, playerId],
      });
    },
    [writeContract],
  );

  const emergencyRefund = useCallback(
    (matchId: string, playerId: string) => {
      writeContract({
        address: fragboxBettingContractAddress,
        abi: fragBoxBettingAbi,
        functionName: "emergencyRefund",
        args: [matchId, playerId],
      });
    },
    [writeContract],
  );

  const withdraw = useCallback(
    (playerId: string) => {
      writeContract({
        address: fragboxBettingContractAddress,
        abi: fragBoxBettingAbi,
        functionName: "withdraw",
        args: [playerId],
      });
    },
    [writeContract],
  );

  return {
    claim,
    emergencyRefund,
    withdraw,
    isPending,
    isSuccess,
    error,
  };
}
