"use client";

import {
  useIsSignedIn,
  useEvmAddress,
  useCurrentUser,
} from "@coinbase/cdp-hooks";
import EmbeddedWalletButton from "../components/coinbase/EmbeddedWalletButton";
import FaceitLoginButton from "../components/FaceitLoginButton";

export default function AccountPage() {
  const { isSignedIn } = useIsSignedIn();
  const { evmAddress } = useEvmAddress();

  if (!isSignedIn) {
    return (
      <div className="text-center py-20">
        Please sign in with email/social first...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-white mb-8">
        Your Fragbox Account
      </h1>

      {/* Wallet section */}
      <EmbeddedWalletButton />

      {/* Linking section - only show AFTER wallet is created */}
      {evmAddress && (
        <div className="mt-12 bg-zinc-900 border border-zinc-700 rounded-3xl p-8">
          <h2 className="text-xl font-semibold mb-6">
            Link your gaming accounts
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <FaceitLoginButton />
          </div>

          <p className="text-xs text-zinc-400 mt-8">
            Once linked, your embedded wallet will be permanently tied to your
            Faceit/Steam ID for betting.
          </p>
        </div>
      )}
    </div>
  );
}
