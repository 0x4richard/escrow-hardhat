require('@nomicfoundation/hardhat-toolbox');
const dotenv = require("dotenv")

dotenv.config();

const { TESTNET_GOERLI_URL} = process.env;

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "goerli",
  networks: {
    goerli: {
      url: TESTNET_GOERLI_URL,
    }
  },
  paths: {
    artifacts: "./app/src/artifacts",
  },
};
