"use client";

import { AuthButton } from "@coinbase/cdp-react/components/AuthButton";
import {
  useIsSignedIn,
  useEvmAddress,
  useCurrentUser,
} from "@coinbase/cdp-hooks";

export default function EmbeddedWalletButton() {
  const { isSignedIn } = useIsSignedIn();
  const { evmAddress } = useEvmAddress(); // this returns the smart account address when createOnLogin: "smart"
  const { currentUser } = useCurrentUser();

  const smartAccount = currentUser?.evmSmartAccounts?.[0];

  if (isSignedIn && evmAddress) {
    return (
      <div className="p-4 border rounded-xl bg-green-50">
        <p className="font-medium">✅ Embedded Wallet Connected</p>
        <p className="text-sm text-gray-500 break-all">{evmAddress}</p>
        {smartAccount && (
          <p className="text-xs text-green-600">
            Smart Account (gasless ready)
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Create your Fragbox Wallet</h3>
      <AuthButton /> {/* handles email, SMS, Google, etc. */}
      <p className="text-xs text-gray-400 mt-2">
        No seed phrase • Gasless on Base • USDC ready
      </p>
    </div>
  );
}
