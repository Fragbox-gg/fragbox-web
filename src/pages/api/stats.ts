// src/pages/api/stats.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPublicClient, http, parseEventLogs } from "viem";
import { baseSepolia } from "viem/chains";
import { fragBoxBettingAbi } from "@/constants/abi";
import { fragboxBettingContractAddress } from "@/wagmi";

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const USDC_DECIMALS = 6;

function formatUSD(raw: bigint): string {
  const dollars = Number(raw) / 10 ** USDC_DECIMALS;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(dollars);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const betPlacedEvent = fragBoxBettingAbi.find(
      (
        item,
      ): item is Extract<
        (typeof fragBoxBettingAbi)[number],
        { type: "event"; name: "BetPlaced" }
      > => item.type === "event" && item.name === "BetPlaced",
    );

    if (!betPlacedEvent) {
      return res.status(500).json({ error: "BetPlaced event not found" });
    }

    const currentBlock = await publicClient.getBlockNumber();

    // Chunked scan (exactly like process-matches.ts) so we never hit RPC limits
    const MAX_RANGE = 8000n;
    let fromBlock = currentBlock > 200_000n ? currentBlock - 200_000n : 0n; // safe historical range for a portfolio
    const matchIds = new Set<string>();
    let totalWageredRaw = 0n;
    const uniquePlayerIds = new Set<string>(); // Unique Bettors = unique Faceit playerIds

    while (fromBlock <= currentBlock) {
      const toBlock =
        fromBlock + MAX_RANGE - 1n > currentBlock
          ? currentBlock
          : fromBlock + MAX_RANGE - 1n;

      const logs = await publicClient.getLogs({
        address: fragboxBettingContractAddress,
        event: betPlacedEvent,
        fromBlock,
        toBlock,
      });

      const parsed = parseEventLogs({
        abi: fragBoxBettingAbi,
        logs,
      }).filter((log) => log.eventName === "BetPlaced");

      for (const log of parsed) {
        const args = log.args as any;
        if (!args?.matchId || !args?.amount) continue;

        matchIds.add(args.matchId);
        totalWageredRaw += BigInt(args.amount);
        if (args.playerId) uniquePlayerIds.add(args.playerId);
      }

      fromBlock = toBlock + 1n;
    }

    const totalMatches = matchIds.size;
    const uniqueBettors = uniquePlayerIds.size;
    const avgPotRaw =
      totalMatches > 0 ? totalWageredRaw / BigInt(totalMatches) : 0n;

    const stats = {
      totalMatches,
      totalWagered: formatUSD(totalWageredRaw),
      uniqueBettors,
      avgPotSize: formatUSD(avgPotRaw),
    };

    // Cache for 30 seconds (optional but nice for performance)
    res.setHeader("Cache-Control", "public, s-maxage=30");
    res.status(200).json(stats);
  } catch (error: any) {
    console.error("Stats API error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch stats" });
  }
}
