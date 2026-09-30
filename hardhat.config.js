import { defineConfig } from "hardhat/config";

export default {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    artifacts: "./frontend/src/artifacts",
  },
};
