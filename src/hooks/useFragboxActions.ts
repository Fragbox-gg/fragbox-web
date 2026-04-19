import { useReadContract, usePublicClient } from "wagmi";
import { fragBoxBettingAbi } from "@/constants/abi";
import {
  fragboxBettingContractAddress,
  selectedBaseNetwork,
  paymasterUrl,
} from "@/wagmi";
import { keccak256, stringToBytes, encodeFunctionData, parseEther } from "viem";
import { useMemo } from "react";
import { toast } from "sonner";
import { useEvmAddress, useSendUserOperation } from "@coinbase/cdp-hooks";
import { useQuery } from "@tanstack/react-query";

// ───── READ HOOKS (these must be called at the top level) ─────
export function useGetWinnings(playerId?: string) {
  const { evmAddress } = useEvmAddress();

  const playerKey = useMemo(
    () => (playerId ? keccak256(stringToBytes(playerId)) : undefined),
    [playerId],
  );

  console.log(playerId);
  console.log(playerKey);

  return useReadContract({
    address: fragboxBettingContractAddress,
    abi: fragBoxBettingAbi,
    functionName: "getWinnings",
    args: playerKey ? [playerKey] : undefined,
    account: evmAddress as `0x${string}`,
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

// Checks if the player actually placed a bet
export function useHasPlacedBet(matchId?: string, playerId?: string) {
  const matchKey = useMemo(
    () => (matchId ? keccak256(stringToBytes(matchId)) : undefined),
    [matchId],
  );
  const playerKey = useMemo(
    () => (playerId ? keccak256(stringToBytes(playerId)) : undefined),
    [playerId],
  );

  const { data: faction } = useReadContract({
    address: fragboxBettingContractAddress,
    abi: fragBoxBettingAbi,
    functionName: "getPlayerFaction",
    args: matchKey && playerKey ? [matchKey, playerKey] : undefined,
    query: { enabled: !!matchId && !!playerId },
  });

  // Faction enum: 0 = no bet, 1/2 = placed on a side
  return !!faction && Number(faction) !== 0;
}

// ───── Check if player has already claimed or received emergency refund via events ─────
export function useHasBeenProcessed(matchId?: string, playerId?: string) {
  const publicClient = usePublicClient();

  const matchKey = useMemo(
    () => (matchId ? keccak256(stringToBytes(matchId)) : undefined),
    [matchId],
  );

  return useQuery({
    queryKey: ["hasBeenProcessed", matchId, playerId],
    queryFn: async () => {
      if (!matchId || !playerId || !matchKey || !publicClient) return false;

      const matchClaimedEvent = fragBoxBettingAbi.find(
        (
          item,
        ): item is Extract<
          (typeof fragBoxBettingAbi)[number],
          { type: "event"; name: "MatchClaimed" }
        > => item.type === "event" && item.name === "MatchClaimed",
      );

      const emergencyRefundEvent = fragBoxBettingAbi.find(
        (
          item,
        ): item is Extract<
          (typeof fragBoxBettingAbi)[number],
          { type: "event"; name: "EmergencyRefund" }
        > => item.type === "event" && item.name === "EmergencyRefund",
      );

      if (!matchClaimedEvent || !emergencyRefundEvent) return false;

      // ─────────────────────────────────────────────────────────────
      // FIX: Limit block range to prevent 413 Content Too Large
      // ─────────────────────────────────────────────────────────────
      const currentBlock = await publicClient.getBlockNumber();
      const MAX_BLOCKS_BACK = 10000n; // ≈ 2-3 hours of history on Base Sepolia (safe for public RPC)

      const fromBlock =
        currentBlock > MAX_BLOCKS_BACK ? currentBlock - MAX_BLOCKS_BACK : 0n;

      const [claimLogs, refundLogs] = await Promise.all([
        publicClient.getLogs({
          address: fragboxBettingContractAddress,
          event: matchClaimedEvent,
          args: { matchKey } as any,
          fromBlock,
          toBlock: "latest" as const,
        }),
        publicClient.getLogs({
          address: fragboxBettingContractAddress,
          event: emergencyRefundEvent,
          args: { matchKey } as any,
          fromBlock,
          toBlock: "latest" as const,
        }),
      ]);

      const playerHasClaimed = claimLogs.some(
        (log: any) => log.args?.playerId === playerId,
      );
      const playerHasEmergencyRefund = refundLogs.some(
        (log: any) => log.args?.playerId === playerId,
      );

      return playerHasClaimed || playerHasEmergencyRefund;
    },
    enabled: !!matchId && !!playerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15,
    retry: 2,
  });
}

// ───── WRITE ACTIONS ─────
export function useFragboxActions() {
  const { sendUserOperation, status } = useSendUserOperation();
  const { evmAddress } = useEvmAddress();

  const claim = async (matchId: string, playerId: string) => {
    if (!evmAddress) {
      return toast.error("Please sign in first");
    }

    const data = encodeFunctionData({
      abi: fragBoxBettingAbi,
      functionName: "claim",
      args: [matchId, playerId],
    });

    try {
      const hash = await sendUserOperation({
        evmSmartAccount: evmAddress,
        network: selectedBaseNetwork,
        calls: [
          {
            to: fragboxBettingContractAddress,
            value: parseEther("0"),
            data,
          },
        ],
        useCdpPaymaster: true,
        paymasterUrl,
      });

      toast.success("✅ Winnings claimed successfully!", {
        description: `Tx Hash: ${hash.userOperationHash}`,
      });

      return hash;
    } catch (err: any) {
      console.error(err);
      toast.error(err?.shortMessage || err?.message || "Claim failed");
      throw err;
    }
  };

  const emergencyRefund = async (matchId: string, playerId: string) => {
    if (!evmAddress) {
      return toast.error("Please sign in first");
    }

    const data = encodeFunctionData({
      abi: fragBoxBettingAbi,
      functionName: "emergencyRefund",
      args: [matchId, playerId],
    });

    try {
      const hash = await sendUserOperation({
        evmSmartAccount: evmAddress,
        network: selectedBaseNetwork,
        calls: [
          {
            to: fragboxBettingContractAddress,
            value: parseEther("0"),
            data,
          },
        ],
        useCdpPaymaster: true,
        paymasterUrl,
      });

      toast.success("✅ Emergency refund successful!", {
        description: `Tx Hash: ${hash.userOperationHash}`,
      });

      return hash;
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.shortMessage || err?.message || "Emergency refund failed",
      );
      throw err;
    }
  };

  const withdraw = async (playerId: string) => {
    if (!evmAddress) {
      return toast.error("Please sign in first");
    }

    const data = encodeFunctionData({
      abi: fragBoxBettingAbi,
      functionName: "withdraw",
      args: [playerId],
    });

    try {
      const hash = await sendUserOperation({
        evmSmartAccount: evmAddress,
        network: selectedBaseNetwork,
        calls: [
          {
            to: fragboxBettingContractAddress,
            value: parseEther("0"),
            data,
          },
        ],
        useCdpPaymaster: true,
        paymasterUrl,
      });

      toast.success("✅ Withdrawal successful!", {
        description: `Tx Hash: ${hash.userOperationHash}`,
      });

      return hash;
    } catch (err: any) {
      console.error(err);
      toast.error(err?.shortMessage || err?.message || "Withdrawal failed");
      throw err;
    }
  };

  return {
    claim,
    emergencyRefund,
    withdraw,
    isPending: status === "pending",
    isSuccess: status === "success",
    isError: status === "error",
  };
}
