import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Popover, Transition, PopoverButton, PopoverPanel } from '@headlessui/react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'

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

      <main className={styles.main}>
        {/* <ConnectButton /> */}

        <h1 className={styles.title}>
          Welcome to <a href="https://www.rainbowkit.com">RainbowKit</a> +{' '}
          <a href="https://wagmi.sh">wagmi</a> +{' '}
          <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a className={styles.card} href="https://rainbowkit.com">
            <h2>RainbowKit Documentation &rarr;</h2>
            <p>Learn how to customize your wallet connection flow.</p>
          </a>

          <a className={styles.card} href="https://wagmi.sh">
            <h2>wagmi Documentation &rarr;</h2>
            <p>Learn how to interact with Ethereum.</p>
          </a>

          <a
            className={styles.card}
            href="https://github.com/rainbow-me/rainbowkit/tree/main/examples"
          >
            <h2>RainbowKit Examples &rarr;</h2>
            <p>Discover boilerplate example RainbowKit projects.</p>
          </a>

          <a className={styles.card} href="https://nextjs.org/docs">
            <h2>Next.js Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a
            className={styles.card}
            href="https://github.com/vercel/next.js/tree/canary/examples"
          >
            <h2>Next.js Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            className={styles.card}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 pb-8 text-center text-zinc-600 text-[10px] uppercase tracking-widest">
        &copy; 2026 Fragbox.gg
      </footer>
    </div>
  );
};

export default Home;
