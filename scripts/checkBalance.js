const { ethers } = require("ethers");
const { waffle } = require("hardhat");
const fs = require("fs");

const tokendata = JSON.parse(fs.readFileSync("scripts/tokendata.json", "utf8"));
const deploymentdata=JSON.parse(fs.readFileSync("scripts/deploymentdata.json", "utf8"));

// 1. Paste your poolData here
const poolData = {
  factory: deploymentdata.factory,
  token0: tokendata.shoaib,
  token1: tokendata.rayyan, 
  fee: 500, 
  poolExample: {
    token0: { decimals: 18, symbol: 'SHO' },
    token1: { decimals: 18, symbol: 'RAY' }
  }
};

async function getPoolBalances() {
  // 2. Setup Provider 
  // IMPORTANT: Replace with your actual RPC URL
  //const provider = new ethers.providers.JsonRpcProvider("YOUR_RPC_URL_HERE"); 
    const provider = waffle.provider;
  // ABIs
  const factoryAbi = ["function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)"];
  const erc20Abi = ["function balanceOf(address owner) view returns (uint256)"];

  try {
    // 3. Get the Pool Address
    const factoryContract = new ethers.Contract(poolData.factory, factoryAbi, provider);
    const poolAddress = await factoryContract.getPool(poolData.token0, poolData.token1, poolData.fee);
    
    console.log(`Pool Address found: ${poolAddress}`);

    // 4. Fetch Balances
    const token0Contract = new ethers.Contract(poolData.token0, erc20Abi, provider);
    const token1Contract = new ethers.Contract(poolData.token1, erc20Abi, provider);

    const [bal0, bal1] = await Promise.all([
      token0Contract.balanceOf(poolAddress),
      token1Contract.balanceOf(poolAddress)
    ]);

    // 5. Format and Print (Fixed for v5)
    const decimals0 = poolData.poolExample.token0.decimals;
    const decimals1 = poolData.poolExample.token1.decimals;

    console.log(`\n--- Balances in Pool ---`);
    // NOTE: Added .utils here
    console.log(`Token0 (${poolData.poolExample.token0.symbol}): ${ethers.utils.formatUnits(bal0, decimals0)}`);
    console.log(`Token1 (${poolData.poolExample.token1.symbol}): ${ethers.utils.formatUnits(bal1, decimals1)}`);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getPoolBalances();