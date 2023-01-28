require('@nomicfoundation/hardhat-toolbox');
// require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  settings: {
    viaIR: true,
    optimizer: {
      enabled: true,
      runs: 1,
      details: { yul: false },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: 1337,
    },
  },
  solidity: '0.8.17',
};
