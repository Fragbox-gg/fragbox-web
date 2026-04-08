"use client";

import { useReadContract } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { fragBoxBettingAbi } from "@/constants/abi";

export function useRegisteredWallet(faceitGuid: string | undefined) {
  const contractAddress = process.env
    .NEXT_PUBLIC_FRAGBOXBETTING_CONTRACT_ADDRESS as `0x${string}` | undefined;

  const {
    data: registeredWallet,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: fragBoxBettingAbi,
    functionName: "getRegisteredWallet",
    args: faceitGuid ? [faceitGuid] : undefined,
    chainId: baseSepolia.id,
    query: {
      enabled: !!contractAddress && !!faceitGuid, // only run when we have both
    },
  });

  return {
    registeredWallet, // address or undefined
    isLoading,
    error,
    refetch, // call this manually if you need to refresh
  };
}
