// pages/api/process-matches.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { type AbiEvent, createPublicClient, http, parseEventLogs } from "viem";
import { baseSepolia } from "viem/chains";
import { kv } from "@vercel/kv";
import {
  updateMatchRoster,
  updateMatchStatus,
} from "../../lib/cdp-server-wallet";
import { fragBoxBettingAbi } from "@/constants/abi";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_FRAGBOXBETTING_CONTRACT_ADDRESS_BASE_SEPOLIA as `0x${string}`;
const SECRET = process.env.PROCESS_MATCHES_SECRET;

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

async function processNewBets() {
  console.log("🔄 Checking for new BetPlaced events...");

  const lastBlockKey = "lastProcessedBlock";
  let lastProcessedBlock = BigInt((await kv.get(lastBlockKey)) || "0");

  // Extract the specific event type from your ABI
  type BetPlacedEvent = Extract<
    (typeof fragBoxBettingAbi)[number],
    { type: "event"; name: "BetPlaced" }
  >;

  // Use it in the predicate
  const betPlacedEvent = fragBoxBettingAbi.find(
    (item): item is BetPlacedEvent =>
      item.type === "event" && item.name === "BetPlaced",
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
    const parsed = parseEventLogs({ abi: fragBoxBettingAbi, logs: [log] })[0];
    if (parsed.eventName !== "BetPlaced") continue;

    const { matchIdStr, playerId, bettor } = parsed.args as any;

    console.log(`🆕 New bet -> Match: ${matchIdStr} | Player: ${playerId}`);

    await updateMatchRoster(matchIdStr, playerId, bettor);
  }

  const currentBlock = await publicClient.getBlockNumber();
  await kv.set(lastBlockKey, currentBlock.toString());
  console.log(`📌 Last processed block updated to ${currentBlock}`);
}

async function updateActiveMatchStatuses() {
  console.log("🔄 Updating active match statuses...");

  // TODO: store active matchIds in Vercel KV (simple Set)
  const activeMatchIds: string[] = (await kv.get("activeMatchIds")) || [];

  for (const matchIdStr of activeMatchIds) {
    await updateMatchStatus(matchIdStr);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Security: secret check (add ?secret=xxx or header)
  if (
    SECRET &&
    req.query.secret !== SECRET &&
    req.headers["x-secret"] !== SECRET
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
