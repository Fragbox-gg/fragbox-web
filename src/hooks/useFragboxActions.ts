import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { fragBoxBettingAbi } from "@/constants/abi";
import { selectedBaseNetwork, isTestBase } from "@/wagmi";
import { keccak256, stringToBytes } from "viem";
import { useCallback, useMemo } from "react";

export function useFragboxActions() {
  const { address } = useAccount();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  // Your exact contract address pattern (copied from your deposit code)
  const contractAddress = useMemo(() => {
    return (
      isTestBase
        ? process.env.NEXT_PUBLIC_FRAGBOXBETTING_CONTRACT_ADDRESS_BASE_SEPOLIA
        : process.env.NEXT_PUBLIC_FRAGBOXBETTING_CONTRACT_ADDRESS_BASE_MAINNET
    ) as `0x${string}`;
  }, [isTestBase]);

  const getPlayerKey = useCallback((playerId: string) => {
    return keccak256(stringToBytes(playerId));
  }, []);

  // ───── READS ─────
  // Get current winnings for a player (used before withdraw)
  const getWinnings = useCallback(
    (playerId: string) => {
      const playerKey = getPlayerKey(playerId);
      return useReadContract({
        address: contractAddress,
        abi: fragBoxBettingAbi,
        functionName: "getWinnings",
        args: [playerKey],
        query: { enabled: !!playerId && !!contractAddress },
      });
    },
    [contractAddress, getPlayerKey],
  );

  // Optional: check current match status (finished = 2 usually)
  const getMatchStatus = useCallback(
    (matchId: string) => {
      return useReadContract({
        address: contractAddress,
        abi: fragBoxBettingAbi,
        functionName: "getMatchBet",
        args: [keccak256(stringToBytes(matchId))], // contract's getKey logic
        query: { enabled: !!matchId && !!contractAddress },
      });
    },
    [contractAddress],
  );

  // ───── WRITES ─────
  const claim = useCallback(
    (matchId: string, playerId: string) => {
      writeContract({
        address: contractAddress,
        abi: fragBoxBettingAbi,
        functionName: "claim",
        args: [matchId, playerId],
      });
    },
    [writeContract, contractAddress],
  );

  const emergencyRefund = useCallback(
    (matchId: string, playerId: string) => {
      writeContract({
        address: contractAddress,
        abi: fragBoxBettingAbi,
        functionName: "emergencyRefund",
        args: [matchId, playerId],
      });
    },
    [writeContract, contractAddress],
  );

  const withdraw = useCallback(
    (playerId: string) => {
      writeContract({
        address: contractAddress,
        abi: fragBoxBettingAbi,
        functionName: "withdraw",
        args: [playerId],
      });
    },
    [writeContract, contractAddress],
  );

  return {
    claim,
    emergencyRefund,
    withdraw,
    getWinnings,
    getMatchStatus,
    isPending,
    isSuccess,
    error,
  };
}
