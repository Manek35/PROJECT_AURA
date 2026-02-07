// import { AlphaRouter } from "@uniswap/smart-order-router";
// import { ethers,BigNumber } from  "ethers";
// import {Token,CurrencyAmount,TradeType,Percent} from "@uniswap/sdk-core";

// const V3_SWAP_ROUTER_ADDRESS="0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
// const chainId=1;

// const provider= new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/TVAtmn6ES2BGwWHYa3ZG9");

// const router = new AlphaRouter({chainId:chainId,provider:provider});
// console.log(router);

// const name0="Wrapped Ether";
// const symbol0="WETH";
// const decimals0=18;
// const address0="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

// const name1="DAI";
// const symbol1="DAI";
// const decimals1=18;
// const address1="0x6B175474E89094C44Da98b954EedeAC495271d0F";

// const WETH = new Token(chainId,address0,decimals0,symbol0,name0);
// const DAI = new Token(chainId,address1,decimals1,symbol1,name1);

// export const swapUpdatePrice = async(
const deploymentdata = require("../scripts/deploymentdata.json");
const QuoterV2 = require("@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json");
const quoterAddress = deploymentdata.quoter;
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
export const swapUpdatePrice = async (
  inputAmount,
  //     slippageAmount,
  //     deadline,
  //     walletAddress
  // ) =>{
  //     const percentSlippage=new Percent(slippageAmount,100);

  // Check for valid input

  tokenOne,
  tokenTwo,
  fee,
) => {
  const amountIn = ethers.utils.parseUnits(
    inputAmount.toString(),
    tokenOne.decimals,
  );
  if (!inputAmount || inputAmount === "" || isNaN(inputAmount)) {
    return [null, 0, 0];
  }

  const quoterContract = new ethers.Contract(
    quoterAddress,
    QuoterV2.abi,
    provider,

    // const wei =ethers.utils.parseUnits(inputAmount.toString(),decimals0);
    // const currencyAmount = CurrencyAmount.fromRawAmount(
    //     WETH,
    //     BigNumber.from(wei)
  );

  try {
    const params = {
      tokenIn: tokenOne.tokenAddress.tokenAddress,
      tokenOut: tokenTwo.tokenAddress.tokenAddress,
      fee: fee,
      amountIn: amountIn,
      sqrtPriceLimitX96: 0,
    };
    // 2. QuoterV2 returns an object/array: [amountOut, sqrtPriceX96After, initializedTicksCrossed, gasEstimate]
    const quote = await quoterContract.callStatic.quoteExactInputSingle(params);
    // 3. Extract amountOut from the result
    const amountOut = quote.amountOut;
    const formattedAmountOut = ethers.utils.formatUnits(
      amountOut,
      tokenTwo.decimals
    );
    const ratio = (
      parseFloat(formattedAmountOut) / parseFloat(inputAmount)
    ).toFixed(4);
    console.log(`Estimated Output: ${formattedAmountOut} ${tokenTwo.symbol}`);
    return {
      estimatedOutput: formattedAmountOut,
      ratio: ratio,
      amountOutRaw: amountOut,
    };
  } catch (error) {
    console.error("Swap price update failed:", error);
    return null;
  }
};
