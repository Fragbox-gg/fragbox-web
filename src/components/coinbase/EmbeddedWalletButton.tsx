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
    const copyAddress = async () => {
      await navigator.clipboard.writeText(evmAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-3xl p-2.5 text-sm w-full max-w-md">
        {/* Address + copy */}
        <div className="flex items-center gap-2 bg-zinc-800 px-4 py-1.5 rounded-2xl">
          <div className="w-2 h-2 bg-lime-500 rounded-full"></div>
          <span className="font-mono text-zinc-300">
            {evmAddress
              ? `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}`
              : "0x..."}
          </span>
          <button
            onClick={copyAddress}
            className="text-lime-400 hover:text-white transition-colors"
          >
            📋
          </button>
          {copied && (
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-zinc-800 text-lime-400 text-xs px-3 py-1 rounded-2xl shadow-lg whitespace-nowrap">
              wallet address copied
            </div>
          )}
        </div>

        {/* Balance */}
        <div className="font-medium">
          USDC <span className="text-lime-400">$0.00</span>
        </div>

        {/* Deposit / Withdraw */}
        <button className="px-4 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-xs font-medium transition-colors">
          Deposit
        </button>
        <button className="px-4 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-2xl text-xs font-medium transition-colors">
          Withdraw
        </button>
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
    <div className="w-72 bg-zinc-900 border border-zinc-700 rounded-3xl p-5 flex flex-col text-sm">
      {step === "initial" && (
        <button
          onClick={() => setStep("email")}
          className="w-full py-2.5 bg-lime-600 hover:bg-lime-500 text-black font-semibold rounded-2xl text-sm transition-colors"
        >
          Sign in with Email
        </button>
      )}

      {step === "email" && (
        <form onSubmit={handleSendCode} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-lime-400 rounded-2xl px-4 py-2.5 text-sm outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-lime-600 hover:bg-lime-500 text-black font-semibold rounded-2xl text-sm transition-colors"
          >
            {loading ? "Sending..." : "Send code"}
          </button>
          <button
            type="button"
            onClick={() => setStep("initial")}
            className="text-xs text-zinc-400 hover:text-zinc-300 self-start"
          >
            ← back
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOTP} className="flex flex-col gap-3">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            maxLength={6}
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-lime-400 rounded-2xl px-4 py-2.5 text-center text-xl font-mono tracking-widest outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-lime-600 hover:bg-lime-500 text-black font-semibold rounded-2xl text-sm transition-colors"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="text-xs text-zinc-400 hover:text-zinc-300 self-start"
          >
            ← change email
          </button>
        </form>
      )}

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
