// scripts/register-player-wallet.ts
//
// Register a Faceit player wallet on-chain (gasless via paymaster)
//
// Usage:
//   npx tsx scripts/register-player-wallet.ts <playerId> <walletAddress>
//
// Example:
//   npx tsx scripts/register-player-wallet.ts "player123abc" 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
//
// Or set in .env for convenience:
//   PLAYER_ID=player123abc
//   WALLET_ADDRESS=0x742d35Cc6634C0532925a3b844Bc454e4438f44e
//   then just: npx tsx scripts/register-player-wallet.ts

import { CdpClient } from "@coinbase/cdp-sdk";
import dotenv from "dotenv";
import { encodeFunctionData, parseEther } from "viem";
import { fragBoxBettingAbi } from "../src/constants/abi";
import {
  fragboxBettingContractAddress,
  selectedBaseNetwork,
  isTestBase,
  paymasterUrl,
} from "../src/wagmi";

dotenv.config();

async function main() {
  // Get args from CLI or .env fallback
  const playerId = process.argv[2]?.trim() || process.env.PLAYER_ID;
  const walletAddress = process.argv[3]?.trim() || process.env.WALLET_ADDRESS;

  if (
    !playerId ||
    !walletAddress?.startsWith("0x") ||
    walletAddress.length !== 42
  ) {
    console.error("❌ Usage:");
    console.error(
      "   npx tsx scripts/register-player-wallet.ts <playerId> <walletAddress>",
    );
    console.error("\nExample:");
    console.error(
      '   npx tsx scripts/register-player-wallet.ts "player123abc" 0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    );
    console.error("\nOr set PLAYER_ID=... and WALLET_ADDRESS=... in your .env");
    process.exit(1);
  }

  if (!fragboxBettingContractAddress?.startsWith("0x")) {
    console.error(
      "❌ NEXT_PUBLIC_FRAGBOXBETTING_CONTRACT_ADDRESS not set in .env",
    );
    process.exit(1);
  }

  console.log(`🔄 Registering player wallet`);
  console.log(`   Player ID : ${playerId}`);
  console.log(`   Wallet    : ${walletAddress}`);
  console.log(`   Network   : ${selectedBaseNetwork}`);
  console.log(`   Contract  : ${fragboxBettingContractAddress}\n`);

  try {
    const cdp = new CdpClient();

    const owner = await cdp.evm.getOrCreateAccount({ name: "fragbox-owner" });
    const smartAccount = await cdp.evm.getOrCreateSmartAccount({
      name: "fragbox-owner",
      owner,
    });

    console.log(`✅ Using Smart Account: ${smartAccount.address}`);

    const data = encodeFunctionData({
      abi: fragBoxBettingAbi,
      functionName: "registerPlayerWallet",
      args: [playerId, walletAddress as `0x${string}`],
    });

    console.log("🚀 Sending registerPlayerWallet transaction (gasless)...");

    const result = await cdp.evm.sendUserOperation({
      smartAccount: smartAccount,
      network: selectedBaseNetwork,
      calls: [
        {
          to: fragboxBettingContractAddress,
          value: parseEther("0"),
          data,
        },
      ],
      paymasterUrl: paymasterUrl,
    });

    console.log(`✅ UserOp submitted! Hash: ${result.userOpHash}`);

    // Wait for on-chain confirmation (same pattern as your other scripts)
    if (result.userOpHash) {
      console.log("⏳ Waiting for confirmation...");
      const receipt = await smartAccount.waitForUserOperation({
        userOpHash: result.userOpHash,
      });
      console.log(`🎉 Player wallet successfully registered on-chain!`);
      console.log(`   Tx Hash: ${receipt.userOpHash}`);
    }
  } catch (err: any) {
    console.error("💥 Failed to register player wallet:");
    console.error(err.message || err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("💥 Script crashed:", err);
  process.exit(1);
});
