import { CdpClient } from "@coinbase/cdp-sdk";
import dotenv from "dotenv";
import { encodeFunctionData, parseEther } from "viem";
import {
  selectedBaseNetwork,
  fragboxBettingContractAddress,
  paymasterUrl,
} from "../src/wagmi";
import { fragBoxBettingAbi } from "../src/constants/abi";

dotenv.config();

async function main() {
  // Get recipient (your MetaMask address) from CLI or .env
  const recipient = process.argv[2] || process.env.RECIPIENT_ADDRESS;

  if (!recipient?.startsWith("0x") || recipient.length !== 42) {
    console.error("❌ Usage:");
    console.error(
      "   npx tsx scripts/transfer-ownership.ts 0xYourMetaMaskAddressHere",
    );
    console.error("   (or set RECIPIENT_ADDRESS=0x... in .env)");
    process.exit(1);
  }

  if (!fragboxBettingContractAddress?.startsWith("0x")) {
    console.error(
      "❌ NEXT_PUBLIC_FRAGBOXBETTING_CONTRACT_ADDRESS not set in .env",
    );
    process.exit(1);
  }

  if (!paymasterUrl) {
    console.error(
      "❌ CDP paymaster URL not set in .env (CDP_BASE_..._PAYMASTER_ENDPOINT)",
    );
    process.exit(1);
  }

  const cdp = new CdpClient();

  console.log(
    `🔄 Loading server Smart Account "fragbox-owner" on ${selectedBaseNetwork}...`,
  );

  // Exact same pattern as create-server-wallet.ts + drain-server-wallet.ts + register-player-wallet.ts
  const owner = await cdp.evm.getOrCreateAccount({ name: "fragbox-owner" });
  const smartAccount = await cdp.evm.getOrCreateSmartAccount({
    name: "fragbox-owner",
    owner,
  });

  console.log(`✅ Server Smart Account: ${smartAccount.address}`);
  console.log(`📦 Contract: ${fragboxBettingContractAddress}`);
  console.log(`👤 Transferring ownership to: ${recipient}\n`);

  try {
    // Encode transferOwnership(newOwner) using the real contract ABI
    const data = encodeFunctionData({
      abi: fragBoxBettingAbi,
      functionName: "transferOwnership",
      args: [recipient as `0x${string}`],
    });

    console.log("📤 Submitting UserOperation (transferOwnership)...");

    const result = await cdp.evm.sendUserOperation({
      smartAccount,
      network: selectedBaseNetwork,
      calls: [
        {
          to: fragboxBettingContractAddress,
          value: parseEther("0"),
          data,
        },
      ],
      paymasterUrl,
    });

    console.log(`✅ UserOp submitted! Hash: ${result.userOpHash}`);

    console.log("⏳ Waiting for confirmation (this may take 5-15 seconds)...");
    const receipt = await smartAccount.waitForUserOperation({
      userOpHash: result.userOpHash,
    });

    const explorer =
      selectedBaseNetwork === "base" ? "basescan.org" : "sepolia.basescan.org";

    console.log("\n🎉 SUCCESS! Ownership has been transferred on-chain.");
    console.log(
      `🔗 View on Basescan: https://${explorer}/tx/${receipt.userOpHash}`,
    );
    console.log(`📍 New owner: ${recipient}`);
  } catch (error: any) {
    console.error("❌ Failed to transfer ownership:", error.message || error);
    process.exit(1);
  }
}

main().catch(console.error);
