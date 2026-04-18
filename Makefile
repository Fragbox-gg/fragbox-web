install: npm install --legacy-peer-deps

# Wagmi ABI import process from the contract's source code
# Make sure you create wagmi.config.ts file before you run this
generate-abi: npx wagmi generate

create-server-wallet: npx tsx scripts/create-server-wallet.ts

drain-server-wallet: npx tsx scripts/drain-server-wallet.ts

transfer-ownership-from-server-wallet: npx tsx scripts/transfer-ownership-from-server-wallet.ts