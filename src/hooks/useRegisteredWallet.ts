"use client";

import { useReadContract } from "wagmi";
import { fragBoxBettingAbi } from "@/constants/abi";
import { selectedBaseChain, isTestBase } from "@/wagmi";

export function useRegisteredWallet(faceitGuid: string | undefined) {
  const contractAddress = (
    isTestBase
      ? process.env.NEXT_PUBLIC_FRAGBOXBETTING_CONTRACT_ADDRESS_BASE_SEPOLIA
      : process.env.NEXT_PUBLIC_FRAGBOXBETTING_CONTRACT_ADDRESS_BASE_MAINNET
  ) as `0x${string}` | undefined;

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
    chainId: selectedBaseChain.id,
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
