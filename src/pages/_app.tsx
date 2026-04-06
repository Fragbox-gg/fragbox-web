import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";

import { CDPReactProvider } from "@coinbase/cdp-react";

const client = new QueryClient();

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
            >
              <Component {...pageProps} />
            </CDPReactProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default MyApp;
