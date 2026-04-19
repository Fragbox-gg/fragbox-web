# Fragbox.gg - CS2 Faceit Pug Betting Frontend

[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B67F?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![wagmi](https://img.shields.io/badge/wagmi-000000?logo=wagmi&logoColor=white)](https://wagmi.sh)
[![Base](https://img.shields.io/badge/Base-0052FF?logo=base&logoColor=white)](https://base.org/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-fragbox.gg-00FFAA)](https://fragbox.gg)
[![Contracts](https://img.shields.io/badge/Contracts-fragbox--contracts-blue)](https://github.com/Fragbox-gg/fragbox-contracts)

**Frag. Win. Get Paid.**  
The sleek Next.js + TypeScript frontend for **on-chain USDC betting** on Counter-Strike 2 Faceit pickup games.

**⚠️ Demo / Testnet only** — Fake funds & testnet USDC. Built as a production-grade showcase.

---

## 🎮 What is Fragbox?

Fragbox lets you bet USDC **on your own team** in CS2 Faceit pugs and scrims (1v1, 5v5, etc.). The smart contract holds the money in escrow and pays winners automatically once the match result is verified via Faceit API.

Match-fixing is impossible — you can **only bet if you’re verified in the match** and **only on yourself winning**.

Live platform: **[fragbox.gg](https://fragbox.gg)**

---

## ✨ Key Features

- **Gasless & Seamless** — Coinbase Smart Wallet + Paymaster (zero visible gas)
- **Faceit Authentication** — Sign in with Faceit and register your wallet
- **Coinbase On/Off Ramps** — Buy USDC with card/bank instantly
- **Real-time Match Flow** — Live betting UI synced with on-chain state
- **Geolocation Support** — Regional compliance & experience
- **Beautiful Dark Theme** — Built for gamers (fast, modern, responsive)
- **Embedded Wallet Experience** — No MetaMask or self custody wallet needed
- **Claim & Withdraw** — Instant USDC payouts + send to any address

---

## 🎮 Realistic Player Experience

1. Go to **[fragbox.gg](https://fragbox.gg)** → “Sign in with Faceit”
2. “Buy USDC” button appears → pay with card/bank (Coinbase Onramp)
3. Chrome extension (planned) or manual flow detects your active Faceit match → “Bet on this match”
4. Click **Deposit** → transaction happens instantly with zero gas (Coinbase Smart Wallet + Paymaster)
5. After the match → “Claim winnings” → USDC lands in your embedded wallet
6. “Sell for cash” → cash out back to bank via Coinbase

---

## 🛠️ Tech Stack

**Frontend**
- Next.js (Pages Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- RainbowKit + wagmi + viem
- Coinbase CDP Smart Wallet + Paymaster
- Sonner (toasts) + custom hooks for betting flow

**Blockchain Integration**
- Base (Testnet)
- USDC (via wagmi)
- Direct calls to `FragBoxBetting.sol` (see [contracts repo](https://github.com/Fragbox-gg/fragbox-contracts))

**Other**
- Geolocation API
- Coinbase On/Off-ramp SDK
- Vercel deployment

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm or npm

### Installation

```bash
git clone https://github.com/Fragbox-gg/fragbox-web.git
cd fragbox-web
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:3000 to see the app.

### 📸 Demo

Watch the full demo on X:
[Demo Video](https://x.com/LightPat02/status/2045689995365581190)

### 📂 Project Links

Live App: https://fragbox.gg
Smart Contracts: [fragbox-contracts](https://github.com/fragbox-gg/fragbox-contracts)
X / Twitter: [@LightPat02](https://x.com/LightPat02)

### 🤝 Contributing
Pull requests are welcome! Feel free to open issues for bugs, features, or UI improvements.

### 📜 License
MIT — see LICENSE

Built with ❤️ for the CS2 community
Demo project. Bet responsibly. Not financial advice.