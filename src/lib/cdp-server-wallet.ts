// lib/cdp-server-wallet.ts
import { CdpClient } from "@coinbase/cdp-sdk";
import { encodeFunctionData, parseEther } from "viem";
import { fragBoxBettingAbi } from "@/constants/abi";
import { selectedBaseNetwork, isTestBase } from "@/wagmi";

const contractAddress = (
  isTestBase
    ? process.env.NEXT_PUBLIC_FRAGBOXBETTING_CONTRACT_ADDRESS_BASE_SEPOLIA
    : process.env.NEXT_PUBLIC_FRAGBOXBETTING_CONTRACT_ADDRESS_BASE_MAINNET
) as `0x${string}`;

const paymasterUrl = isTestBase
  ? process.env.CDP_BASE_SEPOLIA_PAYMASTER_ENDPOINT
  : process.env.CDP_BASE_MAINNET_PAYMASTER_ENDPOINT;

let cachedSmartAccount: any = null;

async function getSmartAccount() {
  if (cachedSmartAccount) return cachedSmartAccount;

  const cdp = new CdpClient();
  const owner = await cdp.evm.getOrCreateAccount({ name: "fragbox-owner" });
  cachedSmartAccount = await cdp.evm.getOrCreateSmartAccount({
    name: "fragbox-owner",
    owner,
  });

  console.log(`✅ CDP Smart Account ready: ${cachedSmartAccount.address}`);
  return cachedSmartAccount;
}

export async function updateMatchRoster(
  matchId: string,
  playerId: string,
  bettorAddress: string,
) {
  const smartAccount = await getSmartAccount();

  const params = new URLSearchParams({ matchId, playerId });

  const response = await fetch(`/api/fetch-faceit-player-faction?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  const data = await response.json();

  const functionData = encodeFunctionData({
    abi: fragBoxBettingAbi,
    functionName: "updateMatchRoster",
    args: [matchId, playerId, bettorAddress as `0x${string}`, data.faction],
  });

  const cdp = new CdpClient();
  const result = await cdp.evm.sendUserOperation({
    smartAccount,
    network: selectedBaseNetwork,
    calls: [
      {
        to: contractAddress,
        value: parseEther("0"),
        data: functionData,
      },
    ],
    paymasterUrl,
  });

  console.log(
    `✅ UserOp submitted for updateMatchRoster. Hash: ${result.userOpHash}`,
  );

  if (result.userOpHash) {
    console.log("⏳ Waiting for confirmation...");
    const receipt = await smartAccount.waitForUserOperation({
      userOpHash: result.userOpHash,
    });
    console.log(`🎉 updateMatchRoster confirmed on-chain!`);
    return receipt;
  }
}

export async function updateMatchStatus(matchId: string) {
  const smartAccount = await getSmartAccount();

  const params = new URLSearchParams({ matchId });

  const response = await fetch(`/api/fetch-faceit-match-status?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  const data = await response.json();

  const functionData = encodeFunctionData({
    abi: fragBoxBettingAbi,
    functionName: "updateMatchStatus",
    args: [matchId, data.statusCode, data.winnerCode],
  });

  const cdp = new CdpClient();
  const result = await cdp.evm.sendUserOperation({
    smartAccount,
    network: selectedBaseNetwork,
    calls: [
      {
        to: contractAddress,
        value: parseEther("0"),
        data: functionData,
      },
    ],
    paymasterUrl,
  });

  console.log(
    `✅ UserOp submitted for updateMatchStatus. Hash: ${result.userOpHash}`,
  );

  if (result.userOpHash) {
    console.log("⏳ Waiting for confirmation...");
    const receipt = await smartAccount.waitForUserOperation({
      userOpHash: result.userOpHash,
    });
    console.log(`🎉 updateMatchStatus confirmed on-chain!`);
    return receipt;
  }
}
