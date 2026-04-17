"use client";

import { useReadContract } from "wagmi";
import { fragBoxBettingAbi } from "@/constants/abi";
import {
  selectedBaseChain,
  fragboxBettingContractAddress,
} from "@/wagmi";

export function useRegisteredWallet(faceitGuid: string | undefined) {
  const {
    data: registeredWallet,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: fragboxBettingContractAddress,
    abi: fragBoxBettingAbi,
    functionName: "getRegisteredWallet",
    args: faceitGuid ? [faceitGuid] : undefined,
    chainId: selectedBaseChain.id,
    query: {
      enabled: !!fragboxBettingContractAddress && !!faceitGuid, // only run when we have both
    },
  });

  return {
    registeredWallet, // address or undefined
    isLoading,
    error,
    refetch, // call this manually if you need to refresh
  };
}
