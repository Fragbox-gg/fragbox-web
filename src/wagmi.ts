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
