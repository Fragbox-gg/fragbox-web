import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import { FaceitUserInfoProps } from "../lib/faceit/types";
import PlayerMatchHistory from "../components/PlayerMatchHistory";
import { useState } from "react";
import {
  useIsSignedIn,
  useEvmAddress,
  useSendUserOperation,
} from "@coinbase/cdp-hooks";
import { toast } from "sonner";
import { parseUnits, encodeFunctionData, type Address } from "viem";
import {
  fragboxBettingContractAddress,
  selectedBaseNetwork,
  paymasterUrl,
} from "@/wagmi";
import { fragBoxBettingAbi } from "@/constants/abi";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Home: NextPage<FaceitUserInfoProps> = ({ faceitUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Head>
        <title>Fragbox - CS2 Wager Pugs</title>
        <meta content="Frag. Win. Get Paid." name="FRAGBOX.gg" />
        <link href="/favicon_io/favicon.ico" rel="icon" />
      </Head>

      <div className="w-full bg-red-700 text-white text-center py-3 px-4 font-bold text-base md:text-lg shadow-md">
        ⚠️ THIS IS A DEVELOPMENT / COMPUTER SCIENCE PROJECT — TESTNET / FAKE
        FUNDS ONLY — NO REAL MONEY OR REAL CRYPTO BETTING
      </div>

      {/* Animated background layer */}
      <div className="fixed inset-0 min-h-[100dvh] bg-animated -z-10" />

      <Header faceitUser={faceitUser} />

      {/* Main content */}
      <div className="relative z-0" style={{ paddingTop: "8px" }}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero Section */}
          <section className="text-center py-16 bg-zinc-900/50 border border-lime-500/20 rounded-2xl shadow-lime-500/10">
            <h2 className="text-4xl font-bold text-lime-400 neon-glow">
              Frag. Win. Get Paid.
            </h2>
            <p className="text-zinc-300 mt-4 max-w-2xl mx-auto">
              Wager on your CS skills with USDC on Base. Balanced pugs, instant
              payouts, no matchfixing.
            </p>

            <BetOnMatchButton
              faceitUser={faceitUser}
              onOpen={() => {
                if (!faceitUser) {
                  toast.error("Please connect your FACEIT account first", {
                    description: "You need to be linked to bet on a match.",
                  });
                  return;
                }
                setIsModalOpen(true);
              }}
            />
          </section>

          {/* Rest of your sections unchanged */}
          {/* Features Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 border border-lime-500/20 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-lime-400">
                Wager Pugs & Scrims
              </h3>
              <p className="text-zinc-400 mt-2">
                1v1 or 5v5—bet USDC, win the pot. Only players in the match can
                wager.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-lime-500/20 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-lime-400">
                Advanced Matchmaking
              </h3>
              <p className="text-zinc-400 mt-2">
                ML-driven: Roles, playstyle, toxicity balanced for fair games.
              </p>
            </div>
            <div className="bg-zinc-900/50 border border-lime-500/20 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-lime-400">
                Faceit Integration
              </h3>
              <p className="text-zinc-400 mt-2">
                Pull stats, history, and wager on your Faceit matches
                seamlessly.
              </p>
            </div>
          </section>

          {/* Stats Dashboard Section */}
          <section className="bg-zinc-900/30 border border-lime-500/20 p-6 rounded-2xl">
            <h3 className="text-sm font-mono text-lime-400 uppercase tracking-widest mb-6">
              Platform Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Active Matches" value="42" />
              <StatCard label="Total Wagers" value="$12,345" />
              <StatCard label="Players Online" value="1,234" />
              <StatCard label="Avg. Pot Size" value="$50" />
            </div>
          </section>

          {/* Recent Matches Section */}
          <section className="bg-zinc-900/30 border border-lime-500/20 p-6 rounded-2xl">
            <h3 className="text-sm font-mono text-lime-400 uppercase tracking-widest mb-6">
              Recent Matches
            </h3>
            <PlayerMatchHistory faceitUser={faceitUser} />
          </section>
        </main>

        <Footer />
      </div>

      {isModalOpen && (
        <BetOnMatchModal
          faceitUser={faceitUser!}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

function BetOnMatchButton({
  faceitUser,
  onOpen,
}: {
  faceitUser: FaceitUserInfoProps["faceitUser"] | null;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="mt-8 px-8 py-4 bg-lime-500 hover:bg-lime-400 active:bg-lime-600 text-black font-bold text-xl rounded-2xl transition-all neon-glow shadow-xl shadow-lime-500/30 flex items-center gap-3 mx-auto"
    >
      <span>Bet on a Match</span>
      <span className="text-2xl">🎮</span>
    </button>
  );
}

function BetOnMatchModal({
  faceitUser,
  onClose,
}: {
  faceitUser: FaceitUserInfoProps["faceitUser"];
  onClose: () => void;
}) {
  // ... (all your existing state and logic stays EXACTLY the same)
  const { isSignedIn } = useIsSignedIn();
  const { evmAddress } = useEvmAddress();
  const { sendUserOperation, status } = useSendUserOperation();

  const [matchInput, setMatchInput] = useState("");
  const [parsedMatchId, setParsedMatchId] = useState("");
  const [amount, setAmount] = useState("5.00");
  const [tierId, setTierId] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const parseMatchId = (input: string): string => {
    if (!input || typeof input !== "string") return "";

    const trimmed = input.trim();
    if (!trimmed) return "";

    // Precise regex for Faceit match ID format:
    // "1-" + UUID (8-4-4-4-12 hexadecimal groups)
    const uuidRegex =
      /^1-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // 1. If the entire input is already a clean match ID → return it immediately
    if (uuidRegex.test(trimmed)) {
      return trimmed;
    }

    // 2. Try to parse as a URL (handles full links, partial paths, etc.)
    try {
      let urlString = trimmed;
      // Prepend protocol if missing (so new URL() doesn't throw)
      if (!urlString.startsWith("http")) {
        urlString = `https://${urlString}`;
      }
      const url = new URL(urlString);

      // Split the pathname and look for the segment right after "/room/"
      // (covers both /room/1-xxx and /room/1-xxx/scoreboard)
      const segments = url.pathname.split("/").filter(Boolean);

      const roomIndex = segments.indexOf("room");
      if (roomIndex !== -1 && roomIndex + 1 < segments.length) {
        const candidate = segments[roomIndex + 1];
        if (uuidRegex.test(candidate)) {
          return candidate;
        }
      }

      // Fallback: scan every segment for the ID pattern (extra safety)
      for (const segment of segments) {
        if (uuidRegex.test(segment)) {
          return segment;
        }
      }
    } catch {
      // Not a valid URL → fall through to regex search
    }

    // 3. Last resort: search anywhere in the string (covers raw ID or ID embedded in text)
    const searchRegex =
      /1-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
    const match = trimmed.match(searchRegex);
    return match ? match[0] : "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMatchInput(value);
    setParsedMatchId(parseMatchId(value));
  };

  const handleDeposit = async () => {
    if (!isSignedIn || !evmAddress) {
      toast.error("Wallet not connected");
      return;
    }
    if (!parsedMatchId) {
      toast.error("Invalid Faceit match ID");
      return;
    }
    if (!faceitUser?.guid) {
      toast.error("Faceit account not fully linked");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid bet amount");
      return;
    }

    setLoading(true);

    const rawBetAmount = parseUnits(amount, 6);

    const data = encodeFunctionData({
      abi: fragBoxBettingAbi,
      functionName: "deposit",
      args: [parsedMatchId, faceitUser.guid, rawBetAmount, tierId],
    });

    try {
      const result = await sendUserOperation({
        evmSmartAccount: evmAddress as `0x${string}`,
        network: selectedBaseNetwork,
        calls: [
          {
            to: fragboxBettingContractAddress,
            value: parseUnits("0", 18),
            data,
          },
        ],
        useCdpPaymaster: true,
        paymasterUrl: paymasterUrl,
      });

      toast.success("✅ Bet deposited successfully!", {
        description: `Tx Hash: ${result.userOperationHash}`,
      });
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100000] backdrop-blur-sm">
      <div className="bg-zinc-900 border border-lime-500/30 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-lime-500/10 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-3xl font-bold text-lime-400 mb-2">Bet on Match</h2>
        <p className="text-zinc-400 text-sm mb-6">
          Paste your Faceit matchroom link or ID
        </p>

        {/* Match ID Input */}
        <div className="mb-6">
          <label className="block text-xs text-zinc-400 mb-2 font-mono">
            FACEIT MATCHROOM
          </label>
          <input
            type="text"
            value={matchInput}
            onChange={handleInputChange}
            placeholder="https://www.faceit.com/en/cs2/room/1-660accbe-... or just the ID"
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-lime-400 rounded-2xl px-5 py-4 text-sm outline-none font-mono"
          />
          {parsedMatchId && (
            <div className="mt-2 text-xs text-lime-400 font-mono bg-zinc-950 px-3 py-1 rounded-2xl inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
              Match Id: {parsedMatchId}
            </div>
          )}
        </div>

        {/* Bet Amount */}
        <div className="mb-6">
          <label className="block text-xs text-zinc-400 mb-2 font-mono">
            BET AMOUNT (USDC)
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              step="0.01"
              min="5"
              max="10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={(e) => {
                let num = parseFloat(e.target.value);

                if (isNaN(num)) num = 5;
                if (num < 5) num = 5;
                if (num > 10) num = 10;

                setAmount(num.toFixed(2));
              }}
              className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-lime-400 rounded-2xl px-5 py-4 text-3xl font-medium outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleDeposit}
          disabled={loading || !parsedMatchId || status === "pending"}
          className="w-full py-5 bg-lime-500 hover:bg-lime-400 active:bg-lime-600 text-black font-bold text-xl rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading || status === "pending"
            ? "Depositing to contract…"
            : `Deposit $${amount} • Join the Box`}
        </button>

        <p className="text-center text-[10px] text-zinc-500 mt-6">
          Paymaster sponsored • Gasless on Base Sepolia
        </p>
      </div>
    </div>
  );
}

// Helper components
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/40 border border-zinc-800 p-3 rounded-lg">
      <div className="text-[9px] text-zinc-500 uppercase mb-1">{label}</div>
      <div className="text-sm font-mono font-bold text-lime-400">{value}</div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  faceitUser: FaceitUserInfoProps | null;
}> = async (context) => {
  const { req } = context;

  // Manual cookie parser (reuse from callback)
  const getCookieValue = (name: string): string | null => {
    const cookieHeader = req.headers.cookie || "";
    const match = cookieHeader.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const accessToken = getCookieValue("faceit_access_token");
  let faceitUser: FaceitUserInfoProps | null = null;

  if (accessToken) {
    const userInfoUrl = "https://api.faceit.com/auth/v1/resources/userinfo";
    const userResponse = await fetch(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (userResponse.ok) {
      faceitUser = await userResponse.json();
    } else {
      // Token expired/invalid? Clear cookie and redirect to logout if needed
      context.res.setHeader(
        "Set-Cookie",
        "faceit_access_token=; HttpOnly; Path=/; Max-Age=0",
      );
    }
  }

  return { props: { faceitUser } };
};

export default Home;
