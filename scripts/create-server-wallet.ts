// scripts/create-server-wallet.ts
import { CdpClient } from "@coinbase/cdp-sdk";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const cdp = new CdpClient();

  // 1. Create the signer EOA (this never needs ETH)
  const owner = await cdp.evm.createAccount();
  console.log("✅ Signer EOA created:", owner.address);

  // 2. Create the Smart Account (this will be the contract owner)
  const smartAccount = await cdp.evm.createSmartAccount({
    owner: owner,
    name: "fragbox-owner", // optional but recommended for easy lookup
  });

  console.log("\n✅ Server Smart Account created successfully!");
  console.log("Smart Account Address (TRANSFER OWNERSHIP TO THIS):");
  console.log(smartAccount.address);
  console.log("\nNext step:");
  console.log(
    "→ From your personal MetaMask, call transferOwnership(" +
      smartAccount.address +
      ")",
  );
  console.log("   on contract 0x9f232D0015FAe832E6FC23566dc31B1f797788bb");
}

main().catch(console.error);
