"use client";

import { useState, useCallback, useEffect } from "react";
import {
  useSignInWithEmail,
  useVerifyEmailOTP,
  useIsSignedIn,
  useEvmAddress,
  useSendUserOperation,
} from "@coinbase/cdp-hooks";
import { useBalance } from "wagmi";
import { parseEther, parseUnits, erc20Abi, encodeFunctionData } from "viem";
import { selectedBaseNetwork, selectedBaseChain, isTestBase } from "@/wagmi";
import { toast } from "sonner";
import {
  Fund,
  type FundProps,
  FundForm,
  FundFooter,
} from "@coinbase/cdp-react";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

export default function EmbeddedWalletButton() {
  const { signInWithEmail } = useSignInWithEmail();
  const { verifyEmailOTP } = useVerifyEmailOTP();
  const { isSignedIn } = useIsSignedIn();
  const { evmAddress } = useEvmAddress();

  const [step, setStep] = useState<"initial" | "email" | "otp">("initial");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [flowId, setFlowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [faucetLoading, setFaucetLoading] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [userCountry, setUserCountry] = useState<string | undefined>(undefined);
  const [userSubdivision, setUserSubdivision] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("/api/geo");
        const data = await res.json();

        setUserCountry(data.countryCode);
        setUserSubdivision(data.subdivision);
      } catch (err) {
        console.warn("IP geolocation failed", err);
        setUserCountry(undefined);
        setUserSubdivision(undefined);
      }
    };

    fetchLocation();
  }, []);

  const { data: usdcBalanceData } = useBalance({
    address: evmAddress as `0x${string}` | undefined,
    token: (isTestBase
      ? process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE_SEPOLIA
      : process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE_MAINNET) as `0x${string}`,
    chainId: selectedBaseChain.id,
    query: {
      enabled: !!evmAddress,
    },
  });

  const usdcFormatted = usdcBalanceData?.formatted
    ? Number(usdcBalanceData.formatted).toFixed(2)
    : "0.00";

  const handleGetTestUsdc = async () => {
    if (!evmAddress) return;

    setFaucetLoading(true);
    try {
      const res = await fetch("/api/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: evmAddress }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "✅ 1 test USDC sent!", {
          description: "Wait a bit and then refresh",
        });
      } else {
        toast.error(data.error || "Failed to get test USDC");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    } finally {
      setFaucetLoading(false);
    }
  };

  const fetchBuyOptions: FundProps["fetchBuyOptions"] = useCallback(
    async (params) => {
      const res = await fetch(
        `/api/onramp/buy-options?${new URLSearchParams(params)}`,
      );
      return res.json();
    },
    [],
  );

  const fetchBuyQuote: FundProps["fetchBuyQuote"] = useCallback(
    async (params) => {
      const res = await fetch("/api/onramp/buy-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      return res.json();
    },
    [],
  );

  const handleMainnetDeposit = async () => {
    if (!evmAddress) return;
    if (userCountry === undefined) {
      toast.error("Failed to get user geolocation data");
      return;
    }
    setShowFundModal(true);
  };

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
        <button
          onClick={copyAddress}
          className="group flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 px-4 py-1.5 rounded-2xl transition-all relative"
        >
          <div className="w-2 h-2 bg-lime-500 rounded-full"></div>

          <span className="font-mono text-zinc-300 group-hover:text-white transition-colors">
            {evmAddress
              ? `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}`
              : "0x..."}
          </span>

          <span className="text-lime-400 group-hover:text-white transition-colors text-base">
            📋
          </span>

          {copied && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-lime-400 text-xs px-3 py-1 rounded-2xl shadow-lg whitespace-nowrap z-50 border border-zinc-600">
              wallet address copied
            </div>
          )}
        </button>
        {/* Balance */}
        <div className="font-medium">
          <span className="text-lime-400">${usdcFormatted}</span>
        </div>

        {/* Deposit */}
        {isTestBase ? (
          <button
            onClick={handleGetTestUsdc}
            disabled={faucetLoading}
            className="px-4 py-1 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-2xl text-xs font-medium transition-colors"
          >
            Deposit
          </button>
        ) : (
          <>
            <button
              onClick={handleMainnetDeposit}
              className="px-4 py-1 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-2xl text-xs font-medium transition-colors"
            >
              Deposit
            </button>

            {showFundModal && (
              <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] backdrop-blur-sm">
                <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-lime-500/10 relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
                        <span className="text-lime-400">⟡</span>
                        Deposit USDC
                      </h2>

                      {/* ? Help icon */}
                      <Popover className="relative">
                        <PopoverButton className="p-1 rounded-full hover:bg-zinc-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500/50">
                          <QuestionMarkCircleIcon className="h-5 w-5 text-lime-400 hover:text-lime-300" />
                        </PopoverButton>

                        <PopoverPanel className="absolute left-0 top-10 z-50 w-72 bg-zinc-800 border border-zinc-700 rounded-3xl p-4 shadow-xl text-sm text-zinc-300">
                          <div className="font-medium text-lime-400 mb-2">
                            How deposits work
                          </div>
                          <p>
                            This buys USDC on the Base network using Coinbase
                            Pay and sends it instantly to your Fragbox wallet.
                            You&apos;ll see the exact amount after fees before
                            confirming.
                          </p>
                          <div className="text-[10px] text-zinc-500 mt-3 flex items-center gap-1">
                            <span>🔒</span>
                            Secured by Coinbase • Powered by Fragbox
                          </div>
                        </PopoverPanel>
                      </Popover>
                    </div>

                    <button
                      onClick={() => setShowFundModal(false)}
                      className="text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500/50 rounded-xl p-1"
                      aria-label="Close deposit modal"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Coinbase Fund component */}
                  <Fund
                    country={userCountry || ""}
                    subdivision={userSubdivision}
                    cryptoCurrency="USDC"
                    fiatCurrency="usd"
                    fetchBuyQuote={fetchBuyQuote}
                    fetchBuyOptions={fetchBuyOptions}
                    network={selectedBaseNetwork}
                    presetAmountInputs={[5, 10, 25]}
                    destinationAddress={evmAddress}
                    onSuccess={(tx) => {
                      toast.success("Deposit successful!");
                      setShowFundModal(false);
                    }}
                  >
                    <FundForm submitLabel="Deposit USDC" />
                    <FundFooter />
                  </Fund>
                </div>
              </div>
            )}
          </>
        )}

        {/* Withdraw Button */}
        {isTestBase ? (
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-4 py-1 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-2xl text-xs font-medium transition-colors"
          >
            Withdraw
          </button>
        ) : (
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-4 py-1 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-600 rounded-2xl text-xs font-medium transition-colors"
          >
            Withdraw
          </button>
        )}

        {/* === WITHDRAW MODAL === */}
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-lime-500/10 relative">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  {isTestBase
                    ? "Send Testnet USDC on Base Sepolia"
                    : "Cash Out via Coinbase"}
                </h2>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {isTestBase ? (
                /* TESTNET TRANSFER FORM */
                <TestnetWithdrawForm
                  evmAddress={evmAddress}
                  onClose={() => setShowWithdrawModal(false)}
                />
              ) : (
                /* MAINNET OFFRAMP */
                <MainnetOfframpForm
                  evmAddress={evmAddress}
                  userCountry={userCountry}
                  userSubdivision={userSubdivision}
                  onClose={() => setShowWithdrawModal(false)}
                />
              )}
            </div>
          </div>
        )}
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
    <div className="w-72 bg-zinc-900 border border-zinc-700 rounded-3xl p-5 pb-2 flex flex-col text-sm">
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
            ← Back
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
            ← Change Email
          </button>
        </form>
      )}

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      {/* Powered by Coinbase footer – subtle and always visible during login */}
      <div className="mt-1 text-[10px] text-zinc-500 flex items-center justify-center gap-0.75">
        <span>Powered by</span>
        <span className="font-medium">Coinbase</span>
      </div>
    </div>
  );
}

// Testnet form (simple send from Coinbase Smart Wallet)
function TestnetWithdrawForm({
  evmAddress,
  onClose,
}: {
  evmAddress: string;
  onClose: () => void;
}) {
  const { sendUserOperation, status } = useSendUserOperation();
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  const handleSend = async () => {
    if (!amount || !to) {
      return toast.error("Please enter amount and destination address");
    }
    if (!evmAddress) return;

    // Encode a normal ERC-20 `transfer` call
    const data = encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [to as `0x${string}`, parseUnits(amount, 6)],
    });

    try {
      const result = await sendUserOperation({
        evmSmartAccount: evmAddress as `0x${string}`,
        network: selectedBaseNetwork,
        calls: [
          {
            to: process.env
              .NEXT_PUBLIC_USDC_ADDRESS_BASE_SEPOLIA as `0x${string}`,
            value: parseEther("0"),
            data,
          },
        ],
        useCdpPaymaster: true,
        paymasterUrl: process.env.CDP_BASE_SEPOLIA_PAYMASTER_ENDPOINT,
      });

      toast.success("✅ Test USDC sent successfully!", {
        description: "Tx Hash: " + result.userOperationHash,
      });
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Transaction failed");
      console.error(err);
    }
  };

  const isPending = status === "pending";

  return (
    <div className="space-y-6">
      {/* Amount */}
      <div>
        <label className="block text-xs text-zinc-400 mb-1">
          Amount (USDC)
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-lime-400 rounded-2xl px-4 py-3 text-xl outline-none"
          />
        </div>
      </div>

      {/* Destination Address */}
      <div>
        <label className="block text-xs text-zinc-400 mb-1">
          Send to address
        </label>
        <input
          type="text"
          placeholder="0x..."
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 focus:border-lime-400 rounded-2xl px-4 py-3 font-mono outline-none"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={isPending || !amount || !to}
        className="w-full py-3 bg-lime-500 hover:bg-lime-400 active:bg-lime-600 text-black font-semibold rounded-2xl transition-colors disabled:opacity-50"
      >
        {isPending ? "Sending on Base Sepolia..." : "Send USDC"}
      </button>

      <p className="text-[14px] text-zinc-500 text-center">
        This transfers testnet USDC from your Coinbase smart wallet
      </p>
    </div>
  );
}

// Mainnet Offramp form
function MainnetOfframpForm({
  evmAddress,
  userCountry,
  userSubdivision,
  onClose,
}: {
  evmAddress: string;
  userCountry?: string;
  userSubdivision?: string;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCashOut = async () => {
    if (!amount || Number(amount) <= 0) {
      return toast.error("Enter a valid amount");
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("networks", "base");
      if (userCountry) params.append("country", userCountry);
      if (userSubdivision) params.append("subdivision", userSubdivision);
      params.append("networks", "base");
      params.append("cashoutCurrency", "USD"); // always USD for offramp

      // 1. Fetch config once (or on country change)
      const configRes = await fetch(
        `/api/offramp/sell-options?${params.toString()}`,
      );

      if (!configRes.ok) throw new Error("Failed to fetch cashout methods");

      const data = await configRes.json();
      const paymentOptions: { id: string; min: string; max: string }[] =
        data?.paymentMethods || [];

      // 2. Prefer ACH_BANK_ACCOUNT if available, otherwise first valid method
      let paymentMethod = "ACH_BANK_ACCOUNT";
      const achOption = paymentOptions.find(
        (opt) => opt.id.toUpperCase() === "ACH_BANK_ACCOUNT",
      );

      if (achOption) {
        paymentMethod = achOption.id;
      } else if (paymentOptions.length > 0) {
        paymentMethod = paymentOptions[0].id;
      }

      // 3. When calling sell-quote, pass it
      const res = await fetch("/api/offramp/sell-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: userCountry,
          subdivision: userSubdivision,
          sellAmount: amount,
          paymentMethod: paymentMethod,
          sourceAddress: evmAddress,
          partnerUserId: `fragbox-${evmAddress.slice(-12)}`,
        }),
      });

      const responseData = await res.json();

      const redirectUrl = responseData.offrampUrl;

      if (redirectUrl) {
        window.open(redirectUrl);
        onClose();
      } else {
        toast.error(
          data.error?.message ||
            data.error ||
            responseData.error?.message ||
            responseData.error ||
            "Failed to get quote",
        );
      }
    } catch (e) {
      toast.error("Network error - please try again");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs text-zinc-400 mb-1">
          Amount to cash out (USDC)
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 focus:border-lime-400 rounded-2xl px-4 py-3 text-xl outline-none"
        />
      </div>

      <button
        onClick={handleCashOut}
        disabled={loading || !amount}
        className="w-full py-3 bg-lime-500 hover:bg-lime-400 active:bg-lime-600 text-black font-semibold rounded-2xl transition-colors disabled:opacity-50"
      >
        {loading ? "Loading Coinbase Offramp..." : "Continue to Coinbase"}
      </button>

      <p className="text-xs text-zinc-400 text-center">
        You&apos;ll be redirected to Coinbase to complete the cash-out
      </p>
    </div>
  );
}
