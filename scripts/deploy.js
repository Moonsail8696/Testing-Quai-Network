const quais = require('quais');
const { pollFor } = require('quais-polling');
const hre = require('hardhat');

async function main() {
  const ethersContract = await hre.ethers.getContractFactory('Greeter');
  const quaisProvider = new quais.providers.JsonRpcProvider(hre.network.config.url);

  const walletWithProvider = new quais.Wallet(hre.network.config.accounts[0], quaisProvider);
  await quaisProvider.ready;

  const QuaisContract = new quais.ContractFactory(
    ethersContract.interface.fragments,
    ethersContract.bytecode,
    walletWithProvider
  );

  const quaisContract = await QuaisContract.deploy('Hello Quai', {
    gasLimit: 1000000,
  });

  // Use quais-polling to wait for contract to be deployed
  const deployReceipt = await pollFor(
    quaisProvider, // provider passed to poller
    'getTransactionReceipt', // method to call on provider
    [quaisContract.deployTransaction.hash], // params to pass to method
    1.5, // initial polling interval in seconds
    1 // request timeout in seconds
  );
  console.log('Contract deployed to address: ', deployReceipt.contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });