import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  base,
  baseSepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '448fcf93b2a9c65beeac097214c050d3',
  chains: [
    // base,
    baseSepolia,
    ...([]),
  ],
  ssr: true,
});
