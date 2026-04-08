// wagmi.config.ts
import { defineConfig } from "@wagmi/cli";
import { foundry } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/constants/abi.ts",
  plugins: [
    foundry({
      project: "../fragbox-contracts",
      include: ["FragBoxBetting.sol/*.json"],
      exclude: ["**/*.t.sol/*.json", "**/*.s.sol/*.json"],
      forge: {
        build: true,
        clean: false,
        rebuild: true,
      },
    }),
  ],
});
