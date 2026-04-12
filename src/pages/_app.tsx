import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Toaster } from "sonner";

import { config } from "../wagmi";

import { CDPReactProvider } from "@coinbase/cdp-react";
import type { Theme } from "@coinbase/cdp-react/theme";

const client = new QueryClient();

const fragboxTheme: Partial<Theme> = {
  // Core background & cards
  "colors-bg-default": "#18181b", // zinc-900
  "colors-bg-overlay": "#27272a", // zinc-800
  "colors-bg-secondary": "#27272a",

  // Text
  "colors-fg-default": "#f4f4f5", // zinc-100 / near white
  "colors-fg-muted": "#a1a1aa", // zinc-400

  // Primary accent
  "colors-bg-primary": "#65A30D", // lime-600
  "colors-fg-primary": "#65A30D", // accent text/links
  "colors-fg-onPrimary": "#0a0b0d", // dark text on lime buttons

  // Borders & dividers
  "colors-line-default": "#3f3f46", // zinc-700

  "colors-bg-contrast": "#f4f4f5", // used to calculate hover/pressed mixes
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="base:app_id" content="69d2da5b759b9a105ccd8327" />
      </Head>

      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#32CD32",
              accentColorForeground: "black",
              borderRadius: "large",
              fontStack: "system",
              overlayBlur: "small",
            })}
          >
            <CDPReactProvider
              config={{
                projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID!,
                disableAnalytics: true,
                ethereum: {
                  createOnLogin: "smart", // creates the ERC-4337 smart account automatically
                },
                appName: "Fragbox",
              }}
              theme={fragboxTheme}
            >
              <Component {...pageProps} />
              <Toaster position="top-right" richColors closeButton />
            </CDPReactProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default MyApp;
