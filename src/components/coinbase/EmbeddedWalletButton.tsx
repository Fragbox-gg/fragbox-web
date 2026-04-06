"use client";

import { useState } from "react";
import {
  useSignInWithEmail,
  useVerifyEmailOTP,
  useIsSignedIn,
  useEvmAddress,
  useCurrentUser,
  useSignOut,
} from "@coinbase/cdp-hooks";

export default function EmbeddedWalletButton() {
  const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();
  const { isSignedIn } = useIsSignedIn();
  const { evmAddress } = useEvmAddress();
  const { currentUser } = useCurrentUser();
  const { signOut } = useSignOut();

  const [step, setStep] = useState<"initial" | "email" | "otp">("initial");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [flowId, setFlowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const smartAccount = currentUser?.evmSmartAccounts?.[0];

  // Connected state (compact)
  if (isSignedIn && evmAddress) {
    const handleCopy = async () => {
      await navigator.clipboard.writeText(evmAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="bg-zinc-900 border border-lime-500/30 rounded-2xl p-4 text-sm max-w-[280px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
            <span className="font-mono text-lime-400 text-xs">CONNECTED</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-zinc-400 hover:text-white text-xs font-mono"
          >
            📋 {evmAddress.slice(0, 6)}...{evmAddress.slice(-4)}
          </button>
        </div>

        {copied && (
          <div className="absolute mt-1 text-[10px] bg-zinc-800 text-lime-300 px-3 py-1 rounded-xl">
            wallet address copied
          </div>
        )}

        <div className="mt-3 flex justify-between items-baseline">
          <div>
            <div className="text-zinc-400 text-xs">USDC Balance</div>
            <div className="text-2xl font-bold text-white font-mono">$0.00</div>
            {/* TODO: replace with real balance later using viem/wagmi */}
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white">
              Deposit
            </button>
            <button className="px-4 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white">
              Withdraw
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compact sign-in flow
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithEmail({ email });
      setFlowId(result.flowId);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flowId || !otp) return;
    setLoading(true);
    setError(null);
    try {
      await verifyEmailOTP({ flowId, otp });
      setStep("initial");
    } catch (err: any) {
      setError(err.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/80 border border-lime-500/20 rounded-2xl p-4 max-w-[280px]">
      {step === "initial" && (
        <button
          onClick={() => setStep("email")}
          className="w-full py-3 bg-lime-600 hover:bg-lime-500 text-black font-bold rounded-2xl text-base"
        >
          Sign in with Email
        </button>
      )}

      {step === "email" && (
        <form onSubmit={handleSendCode} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-lime-400 rounded-2xl px-4 py-3 text-sm outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-lime-600 hover:bg-lime-500 disabled:bg-zinc-700 text-black font-bold rounded-2xl"
          >
            {loading ? "Sending..." : "Send code"}
          </button>
          <button
            type="button"
            onClick={() => setStep("initial")}
            className="text-xs text-zinc-400 w-full"
          >
            ← back
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOTP} className="space-y-3">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-lime-400 rounded-2xl px-4 py-3 text-center text-2xl font-mono tracking-widest outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-lime-600 hover:bg-lime-500 disabled:bg-zinc-700 text-black font-bold rounded-2xl"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="text-xs text-zinc-400 w-full"
          >
            ← change email
          </button>
        </form>
      )}

      {error && (
        <p className="text-red-400 text-xs text-center mt-2">{error}</p>
      )}
    </div>
  );
}
