install: npm install --legacy-peer-deps

# Wagmi ABI import process from the contract's source code
# Make sure you create wagmi.config.ts file before you run this
generate-abi: npx wagmi generate