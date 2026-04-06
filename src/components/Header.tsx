import React from "react";
import { Fragment, useCallback } from "react";
import {
  Popover,
  Transition,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import FaceitLoginButton from "../components/FaceitLoginButton";
import { FaceitUserInfoProps } from "../pages/api/faceit";
import Image from "next/image";
import EmbeddedWalletButton from "./coinbase/EmbeddedWalletButton";

const Header = ({ faceitUser }: FaceitUserInfoProps) => {
  const handleLogin = useCallback(() => {
    const popup = window.open(
      "/api/auth/faceit",
      "_blank",
      "width=500,height=600",
    );
    const interval = setInterval(() => {
      if (popup?.closed) {
        clearInterval(interval);
        window.location.reload(); // Refresh to detect new cookie
      }
    }, 1000);
  }, []);

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

          <div className="flex items-center justify-end gap-4">
            {faceitUser === undefined || faceitUser === null ? (
              <FaceitLoginButton />
            ) : (
              <div className="flex items-center space-x-3">
                <ConnectButton
                  showBalance={{ smallScreen: false, largeScreen: false }}
                  chainStatus={{ smallScreen: "icon", largeScreen: "icon" }}
                  accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
                />

                <EmbeddedWalletButton />

                <Image
                  src={faceitUser?.picture || "images/225-default-avatar.png"} // Fallback if no pic
                  alt="Profile"
                  width={38}
                  height={38}
                  className="rounded-full ml-3"
                />
                <span className="font-medium text-white">
                  {faceitUser?.nickname}
                </span>
                {/* Optional logout button */}
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch("/api/logout", {
                        method: "GET", // or 'POST' — both work here
                        credentials: "include", // important if you have other cookies/sessions
                      });

                      if (response.redirected) {
                        // The API already sent 302 → Location header
                        window.location.href = response.url || "/";
                      } else {
                        // fallback - in case something changes later
                        window.location.href = "/";
                      }
                    } catch (err) {
                      console.error("Logout failed", err);
                      window.location.href = "/"; // still try to redirect
                    }
                  }}
                  className="
                            px-3 py-1.5            /* Adjusted padding for header fit */
                            bg-lime-600            /* Matches your lime accents */
                            text-white
                            font-medium
                            rounded-md             /* Soft corners like your cards */
                            cursor-pointer         /* Hand cursor on hover */
                            shadow-md              /* Base shadow for pop */
                            hover:bg-lime-700      /* Darken on hover */
                            hover:shadow-lg        /* Increased shadow for lift effect */
                            hover:-translate-y-0.5 /* Subtle upward shift */
                            transition-all
                            duration-200           /* Smooth animation */
                            active:scale-95        /* Press-down feel on click */
                        "
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
