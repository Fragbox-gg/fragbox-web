import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
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

      <Header />

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

        <Footer />
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