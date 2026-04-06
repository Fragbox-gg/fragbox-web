import React from "react";
import { Fragment, useCallback } from "react";
import {
  Popover,
  Transition,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import FaceitLoginButton from "../components/FaceitLoginButton";
import { FaceitUserInfoProps } from "../pages/api/faceit";
import Image from "next/image";
import EmbeddedWalletButton from "./coinbase/EmbeddedWalletButton";
import { useIsSignedIn, useSignOut } from "@coinbase/cdp-hooks";

const Header = ({ faceitUser }: FaceitUserInfoProps) => {
  const { isSignedIn: isCdpSignedIn } = useIsSignedIn();
  const { signOut: signOutCDP } = useSignOut();

  const handleFullLogout = async () => {
    try {
      // 1. Only sign out of CDP if actually signed in
      if (isCdpSignedIn) {
        await signOutCDP();
      }

      // 2. Only hit Faceit logout API if we have a Faceit user
      if (faceitUser) {
        const response = await fetch("/api/logout", {
          method: "GET",
          credentials: "include",
        });

        if (response.redirected) {
          window.location.href = response.url || "/";
          return;
        }
      }

      // Final fallback redirect
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
      window.location.href = "/";
    }
  };

  return (
    <header className="glass-header sticky top-0 z-20">
      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Image
              src="/images/fragbox_green_flat.png"
              alt="Fragbox Logo"
              width={50}
              height={50}
              className="shrink-0 object-contain"
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
                          The high-performance match platform with instant
                          payouts. No points, no skins—just cash in your wallet.
                          Frag. Win. Get paid.
                        </p>
                        <ul className="space-y-2 text-zinc-400 text-xs leading-relaxed">
                          <li>
                            • The Box: Every wager match creates a Box (the
                            prize pool). Teams pay in, winners take the lot.
                          </li>
                          <li>
                            • Instant Payouts: No pending BS. The moment the
                            server hits 13 rounds, the Box is distributed.
                          </li>
                          <li>
                            • Balanced Roles: Our algorithm ensures you’re not
                            stuck with 5 AWPers. We match by playstyle (Entry,
                            IGL, Support).
                          </li>
                          <li>
                            • Reputation Matters: High Rep = Lower fees and
                            faster queues. Low Rep = You’re playing with the
                            bottom-feeders.
                          </li>
                          <li>
                            • Anti-Smurf: We scan your Steam/Leetify history.
                            You only play people as cracked as you are.
                          </li>
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

          <div className="flex items-center gap-4">
            {!faceitUser ? (
              /* STACKED LOGIN BUTTONS (exactly as you asked) */
              <div className="flex flex-col gap-3 items-end">
                <FaceitLoginButton /> {/* Top: Faceit */}
                <EmbeddedWalletButton /> {/* Bottom: Wallet */}
              </div>
            ) : (
              /* Logged-in state */
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-3">
                  <Image
                    src={
                      faceitUser?.picture || "/images/225-default-avatar.png"
                    }
                    alt="Profile"
                    width={38}
                    height={38}
                    className="rounded-full"
                  />
                  <span className="font-medium text-white">
                    {faceitUser?.nickname}
                  </span>
                  <EmbeddedWalletButton /> {/* Wallet still visible */}
                </div>
                <button
                  onClick={handleFullLogout}
                  className="px-5 py-2 bg-lime-600 hover:bg-lime-500 text-white font-medium rounded-xl transition-all active:scale-95 shadow-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
