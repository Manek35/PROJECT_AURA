import Web3Model from  "web3modal";
import { Contract,ethers} from "ethers";
import { Token } from "@uniswap/sdk-core";
import {Pool,Position,nearestUsableTick} from "@uniswap/v3-sdk";
import deploymentdata from  "../scripts/deploymentdata.json";

const wethAdress=deploymentdata.weth;
const factoryAddress=deploymentdata.factory;
const swapRouterAddress=deploymentdata.swapRouter;
const nftDescriptorAddress=deploymentdata.nftDescriptor;
const positionDescriptorAddress=deploymentdata.nonfungibleTokenPositionDescriptor;
const positionManagerAddress=deploymentdata.nonfungiblePositionManager;

const articfacts = {
    NonfungiblePositionManager:require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json"),
    UniswapV3Pool:require("@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json"),
    WETH9:require("../Context/WETH9.json")
};

async function getPoolData(poolContract){
    const [tickSpacing,fee,liquidity,slot0]=await Promise.all([
        poolContract.tickSpacing(),
        poolContract.fee(),
        poolContract.liquidity(),
        poolContract.slot0()
    ]);

    return {
        tickSpacing:tickSpacing,
        fee:fee,
        liquidity:liquidity,
        SqrtPriceX96:slot0[0],
        tick:slot0[1]
    };
}

export const addLiquidityExternal = async (
    tokenAddress1,
    tokenAddress2,
    poolAddress,
    poolFee,
    tokenAmount1,
    tokenAmount2
) => {
    const web3modal = new Web3Model();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const accountAddress = await signer.getAddress();

    const token1Contract = new Contract(
        tokenAddress1,
        articfacts.WETH9.abi,
        provider
    );

    const token2Contract = new Contract(
        tokenAddress2,
        articfacts.WETH9.abi,
        provider
    );

    await token1Contract
    .connect(signer)
    .approve(
        positionManagerAddress,
        ethers.utils.parseEther(tokenAmount1.toString())
    );

    await token2Contract
    .connect(signer)
    .approve(
        positionManagerAddress,
        ethers.utils.parseEther(tokenAmount2.toString())
    );

    const poolContract = new Contract(
        poolAddress,
        articfacts.UniswapV3Pool.abi,
        provider
    );

    const {chainId} = await provider.getNetwork();

    const token1Name =await token1Contract.name();
    const token1Symbol = await token1Contract.symbol();
    const token1Address = await token1Contract.address;
    const token1Decimals = await token1Contract.decimals();

    const token2Name = await token2Contract.name();
    const token2Symbol = await token2Contract.symbol();
    const token2Address = await token2Contract.address;
    const token2Decimals = await token2Contract.decimals();

    const TokenA =new Token(
        chainId,
        token1Address,
        token1Decimals,
        token1Name,
        token1Symbol
    );
    const TokenB =new Token(
        chainId,
        token2Address,
        token2Decimals,
        token2Name,
        token2Symbol
    );

    const poolData = await getPoolData(poolContract);
    console.log(poolData);

    const pool =new Pool(
        TokenA,
        TokenB,
        poolData.fee,
        poolData.SqrtPriceX96.toString(),
        poolData.liquidity.toString(),
        poolData.tick
    );

    const isToken1Smallest = tokenAddress1.toLowerCase() < tokenAddress2.toLowerCase();

    const amount0Input = isToken1Smallest ? tokenAmount1 : tokenAmount2;
    const amount1Input = isToken1Smallest ? tokenAmount2 : tokenAmount1;

    const decimals0 = isToken1Smallest ? token1Decimals : token2Decimals;
    const decimals1 = isToken1Smallest ? token2Decimals : token1Decimals;

    const res={
            pool:pool,
            tickLower:nearestUsableTick(poolData.tick,poolData.tickSpacing)-poolData.tickSpacing*2,
            tickUpper:nearestUsableTick(poolData.tick,poolData.tickSpacing)+poolData.tickSpacing*2,
            amount0: ethers.utils.parseUnits(amount0Input.toString(), decimals0).toString(), // Use actual decimals
            amount1: ethers.utils.parseUnits(amount1Input.toString(), decimals1).toString(), // Use actual decimals
            useFullPrecision: true
         }

    console.log("position data",res);
    const position  =Position.fromAmounts({
            pool:pool,
            tickLower:nearestUsableTick(poolData.tick,poolData.tickSpacing)-poolData.tickSpacing*2,
            tickUpper:nearestUsableTick(poolData.tick,poolData.tickSpacing)+poolData.tickSpacing*2,
            amount0: ethers.utils.parseUnits(amount0Input.toString(), decimals0).toString(), // Use actual decimals
            amount1: ethers.utils.parseUnits(amount1Input.toString(), decimals1).toString(), // Use actual decimals
            useFullPrecision: true
         });
    console.log("position created");
    const {amount0:amount0Desired,amount1:amount1Desired}= position.mintAmounts;
     
    
    const [tokenAAddress, tokenBAddress] = tokenAddress1.toLowerCase() < tokenAddress2.toLowerCase() 
        ? [tokenAddress1, tokenAddress2] 
        : [tokenAddress2, tokenAddress1];
    const params = {
        token0:tokenAAddress,
        token1:tokenBAddress,
        fee:poolData.fee,
        tickLower:nearestUsableTick(poolData.tick,poolData.tickSpacing)-poolData.tickSpacing*2,
        tickUpper:nearestUsableTick(poolData.tick,poolData.tickSpacing)+poolData.tickSpacing*2,
        amount0Desired:amount0Desired.toString(),
        amount1Desired:amount1Desired.toString(),
        amount0Min:0,
        amount1Min:0,
        recipient:accountAddress,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
     };

     const nonfungiblePositionManager = new Contract(
             positionManagerAddress,
             articfacts.NonfungiblePositionManager.abi,
             provider
          );
     
          const tx = await nonfungiblePositionManager
                         .connect(signer)
                         .mint(params,{gasLimit:"3000000"});
          const receipt = await tx.wait();
          console.log("transsction complete");
          return receipt;
}
