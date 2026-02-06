const { ethers } = require("ethers");

const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");

const {
  abi: QuoterABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");

const {getAbi,getPoolImmutables} = require("./priceHelpers");

const MAINNET_URL= `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
console.log(MAINNET_URL);

const provider=new ethers.providers.JsonRpcProvider(MAINNET_URL);

const qutorAddress= "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

export const getPrice = async(inputAmount,poolAddress)=>{
    // Check for valid input
    if(!inputAmount || inputAmount === "" || isNaN(inputAmount)){
        return ["0","",""];
    }

    const poolContract=new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI,
        provider
    );
//console.log(poolContract);
const tokenAddress0  = await poolContract.token0();
const tokenAddress1  = await poolContract.token1();
console.log(tokenAddress0,tokenAddress1);

const tokenAbi0 = await getAbi(tokenAddress0);
const tokenAbi1 = await getAbi(tokenAddress1);

console.log(tokenAbi0,tokenAbi1);

const tokenContract0 = new ethers.Contract(tokenAddress0,tokenAbi0,provider);
const tokenContract1 = new ethers.Contract(tokenAddress1,tokenAbi1,provider);

const tokenSymbol0 = await tokenContract0.symbol();
const tokenSymbol1 = await tokenContract1.symbol();

const tokenDecimal0 = await tokenContract0.decimals();
const tokenDecimal1 = await tokenContract1.decimals();

const quoterContract = new ethers.Contract(qutorAddress,QuoterABI,provider);
const immutables = await getPoolImmutables(poolContract);
const amountIn=ethers.utils.parseUnits(inputAmount.toString(),tokenDecimal0);

const quotedAmountOut= await quoterContract.callStatic.quoteExactInputSingle(
    immutables.token0,
    immutables.token1,
    immutables.fee,
    amountIn,
    0
);

const amountOut=ethers.utils.formatUnits(quotedAmountOut,tokenDecimal1);

return [amountOut,tokenSymbol0,tokenSymbol1];
};