// pages/api/process-matches.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPublicClient, http, parseEventLogs } from "viem";
import { baseSepolia } from "viem/chains";
import { kv } from "@vercel/kv";
import {
  updateMatchRoster,
  updateMatchStatus,
} from "../../lib/cdp-server-wallet";
import { fragBoxBettingAbi } from "@/constants/abi";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_FRAGBOXBETTING_CONTRACT_ADDRESS_BASE_SEPOLIA as `0x${string}`;

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

async function getActiveMatchIds(): Promise<string[]> {
  return (await kv.get<string[]>("activeMatchIds")) || [];
}

async function addActiveMatchId(matchId: string) {
  const ids = new Set(await getActiveMatchIds());
  ids.add(matchId);
  await kv.set("activeMatchIds", Array.from(ids));
}

async function removeActiveMatchId(matchId: string) {
  const ids = new Set(await getActiveMatchIds());
  ids.delete(matchId);
  await kv.set("activeMatchIds", Array.from(ids));
}

async function processNewBets() {
  console.log("🔄 Checking for new BetPlaced events...");
  const lastBlockKey = "lastProcessedBlock";
  let lastProcessedBlock = BigInt((await kv.get(lastBlockKey)) || "0");

  const betPlacedEvent = fragBoxBettingAbi.find(
    (
      item,
    ): item is Extract<
      (typeof fragBoxBettingAbi)[number],
      { type: "event"; name: "BetPlaced" }
    > => item.type === "event" && item.name === "BetPlaced",
  );

  if (!betPlacedEvent) {
    console.warn("⚠️ BetPlaced event not found in ABI");
    return;
  }

  const logs = await publicClient.getLogs({
    address: CONTRACT_ADDRESS,
    event: betPlacedEvent,
    fromBlock: lastProcessedBlock + 1n,
    toBlock: "latest",
  });

  for (const log of logs) {
    try {
      const parsed = parseEventLogs({ abi: fragBoxBettingAbi, logs: [log] })[0];
      if (parsed.eventName !== "BetPlaced") continue;

      const { matchId: matchIdStr, playerId, bettor } = parsed.args as any;
      console.log(`🆕 New bet -> Match: ${matchIdStr} | Player: ${playerId}`);

      await updateMatchRoster(matchIdStr, playerId, bettor);
      await addActiveMatchId(matchIdStr); // activate the match
    } catch (e) {
      console.error("Failed processing single BetPlaced:", e);
    }
  }

  const currentBlock = await publicClient.getBlockNumber();
  await kv.set(lastBlockKey, currentBlock.toString());
  console.log(`📌 Last processed block updated to ${currentBlock}`);
}

async function updateActiveMatchStatuses() {
  console.log("🔄 Updating active match statuses...");
  const activeMatchIds = await getActiveMatchIds();
  const toRemove: string[] = [];

  for (const matchIdStr of activeMatchIds) {
    try {
      const statusData = await updateMatchStatus(matchIdStr);
      if (statusData?.statusCode === 4) {
        // FINISHED
        toRemove.push(matchIdStr);
        console.log(`✅ Match ${matchIdStr} finished -> removed from active`);
      }
    } catch (e) {
      console.error(`Failed updating status for ${matchIdStr}:`, e);
    }
  }

  for (const id of toRemove) {
    await removeActiveMatchId(id);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (
    process.env.CRON_SECRET &&
    req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await processNewBets();
    await updateActiveMatchStatuses();
    res
      .status(200)
      .json({ success: true, message: "Match processing completed" });
  } catch (error: any) {
    console.error("💥 Process-matches failed:", error);
    res.status(500).json({ error: error.message });
  }
}
