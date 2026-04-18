import { useReadContract } from "wagmi";
import { fragBoxBettingAbi } from "@/constants/abi";
import {
  fragboxBettingContractAddress,
  selectedBaseNetwork,
  paymasterUrl,
} from "@/wagmi";
import { keccak256, stringToBytes, encodeFunctionData, parseEther } from "viem";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  useSignInWithEmail,
  useVerifyEmailOTP,
  useIsSignedIn,
  useEvmAddress,
  useSendUserOperation,
} from "@coinbase/cdp-hooks";

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

// Checks if the player actually placed a bet
export function useHasPlacedBet(matchId?: string, playerId?: string) {
  const matchKey = useMemo(
    () => (matchId ? keccak256(stringToBytes(matchId)) : undefined),
    [matchId],
  );
  const playerKey = useMemo(
    () => (playerId ? getPlayerKey(playerId) : undefined),
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
