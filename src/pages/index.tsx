import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Popover, Transition, PopoverButton, PopoverPanel } from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Rectangle } from 'recharts';

const Home: NextPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Head>
        <title>FRAGBOX.gg</title>
        <meta
          content="Frag. Win. Get Paid."
          name="FRAGBOX.gg"
        />
        <link href="/favicon_io/favicon.ico" rel="icon" />
      </Head>

      {/* Animated background layer – full screen, behind everything */}
      <div className="fixed inset-0 min-h-[100dvh] bg-animated -z-10" />

      {/* --- HEADER --- */}
      <header className="glass-header sticky top-0 z-20">
        {/* This div creates full-viewport-width black background */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">  {/* Top/bottom padding here */}
          <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              {/* Logo image – shrink-0 prevents it from being squished */}
              <img
                src="/images/fragbox_green_flat.png"
                alt="Fragbox Logo"
                className="w-14 h-14 shrink-0 object-contain"
              />

              {/* Text block – no extra wrapper needed */}
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-widest text-indigo-500 font-mono leading-tight">
                  FRAGBOX.GG
                </h1>
                <p className="text-zinc-500 text-xs uppercase tracking-tighter leading-none">
                  Secure the Box.
                </p>
              </div>

              {/* Help Popover here */}
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <PopoverButton className="p-1 rounded-full hover:bg-indigo-950/40 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                      <QuestionMarkCircleIcon className="h-5 w-5 text-indigo-400 hover:text-indigo-300" />
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
                      <PopoverPanel className="
                        absolute left-1/2 -translate-x-1/2 mt-2 w-80 sm:w-96
                        border border-indigo-500/30 rounded-lg shadow-2xl
                        text-zinc-200 text-sm
                        overflow-hidden z-30
                        bg-zinc-950/95
                      ">
                        <div className="p-5 space-y-4">
                          <h3 className="font-semibold text-indigo-400 text-base">
                            Fragbox Overview
                          </h3>

                          <p>
                            The high-performance match platform with instant payouts. No points, no skins-just cash in your wallet. Frag. Win. Get paid.
                          </p>

                          <ul className="space-y-2 text-zinc-400 text-xs leading-relaxed">
                            <li>• The Box: Every wager match creates a "Box" (the prize pool). Teams pay in, winners take the lot.</li>
                            <li>• Instant Payouts: No "pending" BS. The moment the server hits 13 rounds, the Box is distributed.</li>
                            <li>• Balanced Roles: Our algorithm ensures you aren't stuck with 5 AWPers. We match by playstyle (Entry, IGL, Support).</li>
                            <li>• Reputation Matters: High Rep = Lower fees and faster queues. Low Rep = You're playing with the bottom-feeders.</li>
                            <li>• Anti-Smurf: We scan your Steam/Leetify history. You only play people as cracked as you are.</li>
                          </ul>

                          <div className="pt-2 border-t border-zinc-700/50 text-center">
                            <a
                              href="https://github.com/Fragbox-gg/fragbox-web"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 text-xs underline"
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

            {/* <a
              href="https://sepolia.etherscan.io/address/0x6aA0e5fD458D3c0BCfE55Fe51bA292f866CD2E74"
              target="_blank"
              rel="noopener noreferrer"
              className="
                px-3 py-1.5 text-xs font-medium
                text-indigo-400 hover:text-indigo-300
                bg-indigo-950/40 hover:bg-indigo-900/50
                border border-indigo-500/30 hover:border-indigo-400/50
                rounded-md transition-colors duration-150
                whitespace-nowrap
              "
            >
              View on Etherscan ↗
            </a> */}
          </div>
        </div>
      </header>

      {/* All your visible content – sits on top of animated background */}
      <div className={styles.container + " relative z-0"} style={{ paddingTop: '8px' }}>
        
        {/* --- MAIN BENTO GRID --- */}
        <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-min">
          
          {/* 1. IDENTITY BOX (Span 4) */}
          <div className="md:col-span-4 bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              {/* Header with avatar + name/title side-by-side */}
              <div className="flex items-center gap-4 sm:gap-5 mb-5">
                <div className="flex-shrink-0">
                  <img
                    src="/images/fragbox_green_flat.png"
                    alt="Placeholder"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover"
                  />
                </div>
                
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold leading-tight">Fragbox</h2>
                  <p className="text-indigo-400 font-mono text-sm mt-0.5">CS2 Wager Pug Platform</p>

                  {/* Social links – added here */}
                  <div className="flex gap-3 mt-3">
                    <a
                      href="https://www.linkedin.com/in/patrick-seeman-5842841a0/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      aria-label="LinkedIn profile"
                    >
                      <img 
                        src="/images/fragbox_green_flat.png" 
                        alt="LinkedIn" 
                        className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                      />
                    </a>
                    
                    <a
                      href="https://github.com/LightPat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-200 transition-colors"
                      aria-label="GitHub profile"
                    >
                      <img 
                        src="/images/fragbox_green_flat.png" 
                        alt="GitHub" 
                        className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                      />
                    </a>
                  </div>
                </div>
              </div>
              <p className="text-indigo-400 font-mono text-sm">Smart Contract Engineer | Solidity & Foundry</p>
              <p className="text-zinc-400 mt-4 text-sm leading-relaxed">
                Building secure smart contracts & DeFi protocols. Foundry expert with hands-on projects in stablecoins and NFT collections. Background in high-stakes data engineering and ML at Cleveland Clinic.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://github.com/LightPat/foundry-defi-stablecoin" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-90 transition-opacity"><span className="px-3 py-1 bg-zinc-800 rounded-full text-xs border border-zinc-700">Solidity</span></a>
              <a href="https://www.getfoundry.sh/" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-90 transition-opacity"><span className="px-3 py-1 bg-zinc-800 rounded-full text-xs border border-zinc-700">Foundry</span></a>
              <a href="https://github.com/LightPat/Mobilenet-Image-Classification" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-90 transition-opacity"><span className="px-3 py-1 bg-zinc-800 rounded-full text-xs border border-zinc-700">Python</span></a>
              <a href="https://play.google.com/store/apps/details?id=com.GridlockGames.ViTheGame&hl=en_US" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-90 transition-opacity"><span className="px-3 py-1 bg-zinc-800 rounded-full text-xs border border-zinc-700">C#</span></a>
              <a href="https://aws.amazon.com/what-is/sql/" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-90 transition-opacity"><span className="px-3 py-1 bg-zinc-800 rounded-full text-xs border border-zinc-700">SQL</span></a>
            </div>
          </div>

          {/* 2. MINT INTERFACE (Span 5) */}
          <div className="md:col-span-5 bg-zinc-900 border border-indigo-500/20 p-6 rounded-2xl shadow-xl shadow-indigo-500/5">
            <h3 className="text-sm font-mono text-indigo-400 mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              Execute_Mint
            </h3>
            <div className="space-y-4">
              <div className="group">
                <label className="text-[10px] text-zinc-500 uppercase ml-1">Deposit WETH</label>
                <input 
                  type="number" 
                  className="w-full bg-black border border-zinc-800 p-4 rounded-xl mt-1 focus:border-indigo-500 transition-all outline-none font-mono text-lg" 
                  placeholder="0.00" 
                  
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase ml-1">Mint DSC</label>
                <input 
                  type="number" 
                  className="w-full bg-black border border-zinc-800 p-4 rounded-xl mt-1 focus:border-indigo-500 transition-all outline-none font-mono text-lg" 
                  placeholder="0.00" 
                />
              </div>

              {true ? (
                false ? (
                  <button
                    disabled={false}
                    className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-yellow-600/20 mt-2 disabled:opacity-50"
                  >
                    Approve WETH
                  </button>
                ) : (
                  <button
                    disabled={false}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 mt-2 disabled:opacity-50"
                  >
                    DEPOSIT & MINT
                  </button>
                )
              ) : (
                <button disabled className="w-full bg-zinc-700 text-zinc-400 font-bold py-4 rounded-xl mt-2 cursor-not-allowed">
                  Enter amounts to continue
                </button>
              )}
            </div>
          </div>

          {/* 3. QUICK HEALTH STAT (Span 3) */}
          <div className="md:col-span-3 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <h3 className="text-[10px] text-zinc-500 uppercase mb-4 tracking-[0.2em]">Account_Safety</h3>
            <div className={`text-5xl font-mono font-bold ${Number(0) > 1.5 && true ? 'text-emerald-500' : 'text-amber-500'}`}>
              {"---"}
            </div>
            <p className="text-zinc-500 text-[10px] mt-2 font-mono">Health Factor</p>
            <div className="w-full bg-zinc-800 h-1.5 mt-6 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${Number(0) > 1.5 && true ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                style={{ width: true ? `${Math.min(Number(0) * 20, 100)}%` : '0%' }}
              ></div>
            </div>
          </div>

          {/* 4. ANALYTICS DASHBOARD (Span 8) */}
          <div className="md:col-span-8 bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl min-h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono text-emerald-400 uppercase tracking-widest">Protocol_Metrics</h3>
              <div className="text-[10px] text-zinc-500 font-mono">LIVE_ANVIL_FEED</div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard 
                label="Total Value Locked" 
                value={"Loading..."}
              />
              <StatCard 
                label="DSC Supply" 
                value={"Loading..."}
              />
              <StatCard 
                label="ETH Price" 
                value={"Loading..."}
              />
              <StatCard 
                label="Collateral Ratio" 
                value={"Loading..."}
              />
            </div>

            {/* Health Distribution Chart */}
            <div className="mt-2 border border-dashed border-zinc-800 rounded-xl">
              <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-2 mb-4 text-center">
                System Health Distribution (Users)
              </h4>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[]} 
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis 
                      dataKey="range" 
                      stroke="#52525b" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      fontFamily="monospace"
                    />
                    <YAxis 
                      allowDecimals={false} 
                      stroke="#52525b" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      fontFamily="monospace" 
                    />
                    {/* <Tooltip
                      cursor={{ fill: '#27272a', opacity: 0.4 }}
                      contentStyle={{ 
                        backgroundColor: '#18181b',
                        borderColor: '#27272a',    
                        borderRadius: '12px', 
                        color: '#a1a1aa',          
                        fontFamily: 'monospace',
                        fontSize: '12px' 
                      }}
                      itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
                      formatter={(value: number | undefined) => [`${value || 0} Users`, 'Positions']}
                      labelStyle={{ color: '#d4d4d8', marginBottom: '4px' }}
                    /> */}
                    <Bar 
                      dataKey="users" 
                      shape={(props: any) => {
                        // Destructure payload to get our custom fill color, pass the rest to Rectangle
                        const { payload, ...rest } = props;
                        return <Rectangle {...rest} fill={payload.fill} radius={[4, 4, 0, 0]} />;
                      }} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 5. EXPERIENCE LOG (Span 4) */}
          <div className="md:col-span-4 bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl">
            <h3 className="text-sm font-mono text-zinc-400 mb-6 uppercase tracking-widest">Experience_Log</h3>
            <ul className="space-y-6">
              <ExperienceItem 
                title="Research Data Scientist I" 
                org="Cleveland Clinic" 
                period="Feb 2026 - Present"
                desc="Restructured data warehouse for more optimal queries and ease of use for clinical studies"
              />
            </ul>
          </div>
        </main>

        <footer className="max-w-7xl mx-auto mt-12 pb-8 text-center text-zinc-600 text-[10px] uppercase tracking-widest">
          &copy; 2026 Patrick Seeman // Engineered for Stability
        </footer>
      </div>

      <footer className="max-w-7xl mx-auto mt-12 pb-8 text-center text-zinc-600 text-[10px] uppercase tracking-widest">
        &copy; 2026 Fragbox.gg
      </footer>
    </div>
  );
};

// Small helper components to keep code clean
function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-black/40 border border-zinc-800 p-3 rounded-lg">
      <div className="text-[9px] text-zinc-500 uppercase mb-1">{label}</div>
      <div className="text-sm font-mono font-bold text-zinc-200">{value}</div>
    </div>
  );
}

function ExperienceItem({ title, org, period, desc }: { title: string, org: string, period: string, desc: string }) {
  return (
    <div className="border-l-2 border-zinc-800 pl-4 pb-1"> {/* pb-1 optional – breathing room between items */}
      <div className="flex justify-between items-baseline gap-4">
        <div className="text-sm font-semibold text-zinc-100">
          {title}
        </div>
        <div className="text-[13px] text-zinc-500 font-medium shrink-0 whitespace-nowrap">
          {period}
        </div>
      </div>

      {/* Organization on its own line – lighter & smaller */}
      <div className="text-[12px] text-zinc-400 mt-0.5 mb-1.5">
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
