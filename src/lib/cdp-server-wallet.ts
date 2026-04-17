// src/lib/cdp-server-wallet.ts
import { CdpClient } from "@coinbase/cdp-sdk";
import { encodeFunctionData, parseEther } from "viem";
import { fragBoxBettingAbi } from "@/constants/abi";
import {
  fragboxBettingContractAddress,
  paymasterUrl,
  selectedBaseNetwork,
} from "@/wagmi";
import { getPlayerFaction, getMatchStatus } from "./faceit/faceit-api";

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
  const { faction } = await getPlayerFaction(matchId, playerId);

  const functionData = encodeFunctionData({
    abi: fragBoxBettingAbi,
    functionName: "updateMatchRoster",
    args: [matchId, playerId, bettorAddress as `0x${string}`, faction],
  });

  const cdp = new CdpClient();
  const result = await cdp.evm.sendUserOperation({
    smartAccount,
    network: selectedBaseNetwork,
    calls: [
      {
        to: fragboxBettingContractAddress,
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
    const receipt = await smartAccount.waitForUserOperation({
      userOpHash: result.userOpHash,
    });
    console.log(`🎉 updateMatchRoster confirmed!`);
    return receipt;
  }
}

export async function updateMatchStatus(matchId: string) {
  const smartAccount = await getSmartAccount();
  const data = await getMatchStatus(matchId);

  const functionData = encodeFunctionData({
    abi: fragBoxBettingAbi,
    functionName: "updateMatchStatus",
    args: [matchId, data.statusCode, data.winnerCode], // uses the 3-arg overload
  });

  const cdp = new CdpClient();
  const result = await cdp.evm.sendUserOperation({
    smartAccount,
    network: selectedBaseNetwork,
    calls: [
      {
        to: fragboxBettingContractAddress,
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
    const receipt = await smartAccount.waitForUserOperation({
      userOpHash: result.userOpHash,
    });
    console.log(`🎉 updateMatchStatus confirmed!`);
    return data; // <- return status so process-matches can decide whether to remove from active
  }
}
