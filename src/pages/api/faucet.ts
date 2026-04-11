import { NextApiRequest, NextApiResponse } from "next";
import { CdpClient } from "@coinbase/cdp-sdk";
import { selectedBaseNetwork } from "@/wagmi";

const cdp = new CdpClient(); // automatically reads CDP_API_KEY_ID + CDP_API_KEY_SECRET from .env.local

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { address } = req.body;

    if (!address || typeof address !== "string" || !address.startsWith("0x")) {
      return res.status(400).json({
        error: "Valid wallet address is required",
      });
    }

    if (selectedBaseNetwork !== "base-sepolia") {
      return res.status(400).json({
        error:
          "The faucet is only available on Base Sepolia. Switch NEXT_PUBLIC_BASE_NETWORK to base-sepolia.",
      });
    }

    const response = await cdp.evm.requestFaucet({
      address,
      network: selectedBaseNetwork,
      token: "usdc",
    });

    return res.status(200).json({
      success: true,
      message: "✅ 1 test USDC sent to your wallet!",
      data: response, // contains tx hash, etc.
    });
  } catch (error: any) {
    console.error("Faucet error:", error);

    // Coinbase faucet returns 429 on daily limit
    if (
      error?.status === 429 ||
      error?.message?.toLowerCase().includes("rate limit")
    ) {
      return res.status(429).json({
        error: "You've already claimed test USDC today. Come back in 24 hours!",
      });
    }

    return res.status(500).json({
      error: error?.message || "Failed to request test USDC",
    });
  }
}
