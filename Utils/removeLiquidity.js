import { ethers ,Contract} from "ethers";
import Web3Model from "web3modal";
import deploymentdata from "../scripts/deploymentdata.json";

const positionManagerAddress = deploymentdata.nonfungiblePositionManager;

const artifacts = {
  NonfungiblePositionManager: require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
};

export const removeLiquidity = async (tokenId) => {
  const web3modal = new Web3Model();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const accountAddress = await signer.getAddress();

  const nonfungiblePositionManager = new Contract(
    positionManagerAddress,
    artifacts.NonfungiblePositionManager.abi,
    signer // connected to signer to send transactions
  );

  // 1. Fetch current liquidity of the position
  const position = await nonfungiblePositionManager.positions(tokenId);
  const liquidity = position.liquidity;

  if (liquidity.isZero()) {
    throw new Error("No liquidity in this position.");
  }

  // 2. Prepare Decrease Liquidity Parameters
  // We remove 100% of the liquidity in this example
  const decreaseParams = {
    tokenId: tokenId,
    liquidity: liquidity, 
    amount0Min: 0, // In production, use a slippage calculator
    amount1Min: 0,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
  };

  console.log("Decreasing liquidity...");
  const decreaseTx = await nonfungiblePositionManager.decreaseLiquidity(decreaseParams, {
    gasLimit: 500000,
  });
  await decreaseTx.wait();

  // 3. Prepare Collect Parameters
  // After decreasing, the tokens are sitting in the contract ready to be claimed.
  const collectParams = {
    tokenId: tokenId,
    recipient: accountAddress,
    amount0Max: ethers.BigNumber.from(2).pow(128).sub(1), // Max uint128
    amount1Max: ethers.BigNumber.from(2).pow(128).sub(1),
  };

  console.log("Collecting assets...");
  const collectTx = await nonfungiblePositionManager.collect(collectParams, {
    gasLimit: 500000,
  });
  const receipt = await collectTx.wait();

  console.log("Liquidity removed and assets retrieved!");
  return receipt;
};
