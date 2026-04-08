// scripts/drain-server-wallet.ts
//
// Similar structure/style to your create-server-wallet.ts (uses @coinbase/cdp-sdk,
// same "fragbox-owner" named Smart Account, dotenv, and the high-level transfer API).
//
// This script:
//   1. Loads the existing server Smart Account ("fragbox-owner")
//   2. Fetches current ETH + USDC balances
//   3. Sends **all** USDC and **almost all** native ETH (leaves ~0.0001 ETH for gas/safety)
//      to the target address you provide.
//
// Run it with:
//   npx tsx scripts/drain-server-wallet.ts 0xYourPersonalWalletAddressHere
//
// Or set RECIPIENT_ADDRESS=0x... in your .env file (script will fall back to it).

import { CdpClient } from "@coinbase/cdp-sdk";
import dotenv from "dotenv";
import { parseEther } from "viem";

dotenv.config();

async function main() {
  // Get recipient from CLI arg or env
  const recipient = process.argv[2] || process.env.RECIPIENT_ADDRESS;
  if (!recipient?.startsWith("0x") || recipient.length !== 42) {
    console.error("❌ Usage:");
    console.error(
      "   npx tsx scripts/drain-server-wallet.ts 0xYourTargetAddress",
    );
    console.error("   (or set RECIPIENT_ADDRESS=0x... in .env)");
    process.exit(1);
  }

  // Network – change to "base-sepolia" if your server wallet is on testnet
  // Change to "base" on mainnet
  const network = "base-sepolia";

  const cdp = new CdpClient();

  console.log(
    `🔄 Loading server Smart Account "fragbox-owner" on ${network}...`,
  );

  // Re-use the exact same owner + Smart Account creation pattern as create-server-wallet.ts
  const owner = await cdp.evm.getOrCreateAccount({ name: "fragbox-owner" });
  const smartAccount = await cdp.evm.getOrCreateSmartAccount({
    name: "fragbox-owner",
    owner,
  });

  console.log(`✅ Server Smart Account: ${smartAccount.address}`);
  console.log(`💰 Sending everything to: ${recipient}\n`);

  // Fetch balances (same method used in query-embedded-wallet.ts style)
  const balancesResponse = await smartAccount.listTokenBalances({ network });
  const tokenBalances = balancesResponse.balances || [];

  console.log("📊 Current balances:");
  tokenBalances.forEach((b: any) => {
    console.log(
      `   • ${b.token.symbol || b.token.name}: ${Number(b.amount.amount) / 10 ** b.amount.decimals}`,
    );
  });
  console.log("");

  // Helper to execute a transfer (uses the same .transfer() + waitForUserOperation pattern)
  const transfer = async (
    token: "eth" | "usdc",
    amount: bigint,
    symbol: string,
  ) => {
    if (amount <= BigInt(0)) {
      console.log(`   No ${symbol} to send.`);
      return;
    }

    console.log(`🚀 Sending ${symbol}...`);
    try {
      const result = await smartAccount.transfer({
        to: recipient as `0x${string}`,
        amount, // raw amount (wei for ETH, 6-decimals for USDC)
        token,
        network,
      });

      console.log(
        `   📤 UserOp hash: ${result.userOpHash || result.userOpHash}`,
      );

      // Wait for on-chain confirmation (same as your other wallet scripts)
      const receipt = await smartAccount.waitForUserOperation({
        userOpHash: result.userOpHash,
      });

      console.log(
        `   ✅ ${symbol} sent! Tx: ${receipt.userOpHash || "confirmed"}\n`,
      );
    } catch (err: any) {
      console.error(`   ❌ Failed to send ${symbol}:`, err.message || err);
    }
  };

  // === 1. Drain native ETH (leave a tiny buffer for future gas) ===
  const ethBalance = tokenBalances.find(
    (b: any) => (b.token.symbol || b.token.name || "").toLowerCase() === "eth",
  );
  if (ethBalance) {
    const rawEth = BigInt(ethBalance.amount.amount || 0);
    const reserve = parseEther("0.0001"); // ~0.0001 ETH safety buffer
    const amountToSend = rawEth > reserve ? rawEth - reserve : BigInt(0);

    await transfer("eth", amountToSend, "ETH");
  }

  // === 2. Drain USDC (send everything) ===
  const usdcBalance = tokenBalances.find(
    (b: any) => (b.token.symbol || b.token.name || "").toLowerCase() === "usdc",
  );
  if (usdcBalance) {
    const rawUsdc = BigInt(usdcBalance.amount.amount || 0);
    await transfer("usdc", rawUsdc, "USDC");
  }

  console.log(
    "🎉 Drain complete! Check Basescan / Base Sepolia explorer for the transactions.",
  );
}

main().catch((err) => {
  console.error("💥 Script failed:", err);
  process.exit(1);
});
