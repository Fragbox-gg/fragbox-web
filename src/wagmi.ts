import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "wagmi/chains";

export const selectedBaseNetwork =
  process.env.NEXT_PUBLIC_BASE_NETWORK === "base" ? "base" : "base-sepolia";

export const selectedBaseChain =
  selectedBaseNetwork === "base" ? base : baseSepolia;

export const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "448fcf93b2a9c65beeac097214c050d3",
  chains: [selectedBaseChain],
  ssr: true,
});

export const isTestBase = selectedBaseChain.id === baseSepolia.id;

export const fragboxBettingContractAddress = (
  isTestBase
    ? process.env.NEXT_PUBLIC_FRAGBOXBETTING_CONTRACT_ADDRESS_BASE_SEPOLIA
    : process.env.NEXT_PUBLIC_FRAGBOXBETTING_CONTRACT_ADDRESS_BASE_MAINNET
) as `0x${string}`;

export const paymasterUrl = (
  isTestBase
    ? process.env.CDP_BASE_SEPOLIA_PAYMASTER_ENDPOINT
    : process.env.CDP_BASE_MAINNET_PAYMASTER_ENDPOINT
) as string;

export const usdcAddress = (
  isTestBase
    ? process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE_SEPOLIA
    : process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE_MAINNET
) as `0x${string}`;
