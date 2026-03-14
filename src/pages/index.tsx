import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Popover, Transition, PopoverButton, PopoverPanel } from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Rectangle } from 'recharts';

const Home: NextPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Head>
        <title>FRAGBOX.gg</title>
        <meta content="Frag. Win. Get Paid." name="FRAGBOX.gg" />
        <link href="/favicon_io/favicon.ico" rel="icon" />
      </Head>

      {/* Animated background layer – full screen, behind everything */}
      <div className="fixed inset-0 min-h-[100dvh] bg-animated -z-10" />

      {/* --- HEADER --- */}
      <header className="glass-header sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/images/fragbox_green_flat.png"
                alt="Fragbox Logo"
                className="w-14 h-14 shrink-0 object-contain"
              />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-widest text-lime-500 font-mono leading-tight neon-glow">
                  FRAGBOX.GG
                </h1>
                <p className="text-zinc-500 text-xs uppercase tracking-tighter leading-none">
                  Secure the Box.
                </p>
              </div>
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <PopoverButton className="p-1 rounded-full hover:bg-zinc-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-lime-500/50">
                      <QuestionMarkCircleIcon className="h-5 w-5 text-lime-400 hover:text-lime-300" />
                    </PopoverButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-150"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <PopoverPanel className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 sm:w-96 border border-lime-500/30 rounded-lg shadow-2xl text-zinc-200 text-sm overflow-hidden z-30 bg-zinc-950/95">
                        <div className="p-5 space-y-4">
                          <h3 className="font-semibold text-lime-400 text-base">
                            Fragbox Overview
                          </h3>
                          <p>
                            The high-performance match platform with instant payouts. No points, no skins—just cash in your wallet. Frag. Win. Get paid.
                          </p>
                          <ul className="space-y-2 text-zinc-400 text-xs leading-relaxed">
                            <li>• The Box: Every wager match creates a Box (the prize pool). Teams pay in, winners take the lot.</li>
                            <li>• Instant Payouts: No pending BS. The moment the server hits 13 rounds, the Box is distributed.</li>
                            <li>• Balanced Roles: Our algorithm ensures you’re not stuck with 5 AWPers. We match by playstyle (Entry, IGL, Support).</li>
                            <li>• Reputation Matters: High Rep = Lower fees and faster queues. Low Rep = You’re playing with the bottom-feeders.</li>
                            <li>• Anti-Smurf: We scan your Steam/Leetify history. You only play people as cracked as you are.</li>
                          </ul>
                          <div className="pt-2 border-t border-zinc-700/50 text-center">
                            <a
                              href="https://github.com/Fragbox-gg/fragbox-web"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lime-400 hover:text-lime-300 text-xs underline"
                            >
                              Help Center →
                            </a>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Transition>
                  </>
                )}
              </Popover>
            </div>
            <ConnectButton
              showBalance={{ smallScreen: false, largeScreen: false }}
              chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
              accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-0" style={{ paddingTop: '8px' }}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero Section */}
          <section className="text-center py-16 bg-zinc-900/50 border border-lime-500/20 rounded-2xl shadow-lime-500/10">
            <h2 className="text-4xl font-bold text-lime-400 neon-glow">Frag. Win. Get Paid.</h2>
            <p className="text-zinc-300 mt-4 max-w-2xl mx-auto">
              Wager on your CS skills with USDC on Base. Balanced pugs, instant payouts, no matchfixing.
            </p>
            <button className="mt-8 px-6 py-3 bg-lime-600 text-black font-bold rounded-xl hover:bg-lime-500 transition-all neon-glow">
              Join a Pug Now
            </button>
          </section>

          {/* Features Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 border border-lime-500/20 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-lime-400">Wager Pugs & Scrims</h3>
              <p className="text-zinc-400 mt-2">1v1 or 5v5—bet USDC, win the pot. Only players in the match can wager.</p>
            </div>
            <div className="bg-zinc-900/50 border border-lime-500/20 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-lime-400">Advanced Matchmaking</h3>
              <p className="text-zinc-400 mt-2">ML-driven: Roles, playstyle, toxicity balanced for fair games.</p>
            </div>
            <div className="bg-zinc-900/50 border border-lime-500/20 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-lime-400">Faceit Integration</h3>
              <p className="text-zinc-400 mt-2">Pull stats, history, and wager on your Faceit matches seamlessly.</p>
            </div>
          </section>

          {/* Stats Dashboard Section */}
          <section className="bg-zinc-900/30 border border-lime-500/20 p-6 rounded-2xl">
            <h3 className="text-sm font-mono text-lime-400 uppercase tracking-widest mb-6">Platform Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Active Matches" value="42" />
              <StatCard label="Total Wagers" value="$12,345" />
              <StatCard label="Players Online" value="1,234" />
              <StatCard label="Avg. Pot Size" value="$50" />
            </div>
          </section>

          {/* Recent Matches Section */}
          <section className="bg-zinc-900/30 border border-lime-500/20 p-6 rounded-2xl">
            <h3 className="text-sm font-mono text-lime-400 uppercase tracking-widest mb-6">Recent Matches</h3>
            <ul className="space-y-6">
              <ExperienceItem title="Match #1234" org="5v5 Pug" period="3/14/2026" desc="$100 Pot - Winner: Team A" />
              {/* Add more dynamically */}
            </ul>
          </section>
        </main>

        <footer className="max-w-7xl mx-auto mt-12 pb-8 text-center text-zinc-600 text-[10px] uppercase tracking-widest">
          &copy; 2026 Fragbox.gg
        </footer>
      </div>
    </div>
  );
};

// Helper components (updated colors)
function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-black/40 border border-zinc-800 p-3 rounded-lg">
      <div className="text-[9px] text-zinc-500 uppercase mb-1">{label}</div>
      <div className="text-sm font-mono font-bold text-lime-400">{value}</div>
    </div>
  );
}

function ExperienceItem({ title, org, period, desc }: { title: string, org: string, period: string, desc: string }) {
  return (
    <div className="border-l-2 border-lime-500/20 pl-4 pb-1">
      <div className="flex justify-between items-baseline gap-4">
        <div className="text-sm font-semibold text-lime-300">
          {title}
        </div>
        <div className="text-[13px] text-zinc-500 font-medium shrink-0 whitespace-nowrap">
          {period}
        </div>
      </div>
      <div className="text-[12px] text-lime-400 mt-0.5 mb-1.5">
        {org}
      </div>
      {desc && (
        <div className="text-[11px] text-zinc-400 leading-relaxed">
          {desc}
        </div>
      )}
    </div>
  );
}

export default Home;