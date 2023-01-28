const hre = require('hardhat');

//BUG: https://gateway.pinata.cloud/ipfs是不是重複了？
// const _metadataUri =
//   'https://gateway.pinata.cloud/ipfs/https://gateway.pinata.cloud/ipfs/QmX2ubhtBPtYw75Wrpv6HLb1fhbJqxrnbhDo1RViW3oVoi';
//>pinata是上傳到ipfs的工具,
const _metadataUri =
  'https://gateway.pinata.cloud/ipfs/QmX2ubhtBPtYw75Wrpv6HLb1fhbJqxrnbhDo1RViW3oVoi';

async function deploy(name, ...params) {
  const contractFactory = await ethers.getContractFactory(name);
  //QUES這邊為什麼要傳入array?
  //NOTE:把多個不同的檔案結合成array然後傳入deploy()裡
  return await contractFactory.deploy(...params).then((f) => f.deployed());
}

async function main() {
  const [admin] = await ethers.getSigners();

  console.log(`Deploying a smart contract...`);
  //QUES: _metadataUri 這是array嗎？
  //NOTE:傳入好多個不同的json檔案的意思
  const AVAXGods = (await deploy('AvaxGods', _metadataUri)).connect(admin);

  console.log({ AvaxGods: AVAXGods.address });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
