# Building and Deploying a Uniswap Exchange Clone for DeFi

Enter the world of decentralized finance (DeFi) with our Uniswap Exchange clone, UniClone. This project focuses on replicating the functionalities of the popular decentralized exchange Uniswap, providing users with a seamless and efficient platform for swapping tokens, providing liquidity, and earning fees.

UniClone leverages smart contracts and blockchain technology to enable trustless and permissionless token swaps directly from users' wallets. By replicating Uniswap's automated market maker (AMM) mechanism, our clone ensures liquidity for all listed tokens and allows users to trade without the need for traditional order books or centralized intermediaries.


# IMPORTANT INFO

# Address

MAINNEXT TOKEN ADDRESS

"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
"0xdAC17F958D2ee523a2206206994597C13D831ec7",
"0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
"0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
"0x6B175474E89094C44Da98b954EedeAC495271d0F",
"0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
"0x4278C5d322aB92F1D876Dd7Bd9b44d1748b88af2",
"0x0D92d35D311E54aB8EEA0394d7E773Fc5144491a",
"0x24EcC5E6EaA700368B8FAC259d3fBD045f695A08",

ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

TEST

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI_WHALE = "0x97f991971a37D4Ca58064e6a98FC563F03A71E5c";
const USDC_WHALE = "0x97f991971a37D4Ca58064e6a98FC563F03A71E5c";

const WETH9 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

const qutorAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

ETHERSCAN URL: `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`;

V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

const name0 = "Wrapped Ether";
const symbol0 = "WETH";
const decimals0 = 18;
const address0 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

const name1 = "DAI";
const symbol1 = "DAI";
const decimals1 = 18;
const address1 = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

# //SECOND PACKAGE.JSON FILE

{
"name": "uniswapclone",
"version": "0.1.0",

## Running scripts and tests

This project includes a few npm scripts in `package.json` for running tests and deploying locally. Before running the test script you should start a Hardhat node that is forked from mainnet (so tests that depend on on-chain state or token holders will work).

- To run the scripts defined in `package.json`:

```powershell
# Run tests (this executes the `test` script defined in package.json)
npm run test

# Deploy using the `deploy` script
npm run deploy
```

- Start a Hardhat node forked from Ethereum mainnet (requires an Alchemy API key). Open a separate terminal and run:

```powershell
# Replace YOUR_ALCHEMY_KEY with your Alchemy API key
npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
```

Note: The project `hardhat.config.js` already configures the `hardhat` network for forking using the `ALCHEMY_API_KEY` environment variable. If you prefer to use that configuration you can set the environment variable then run a local Hardhat node:

```powershell
# PowerShell example (temporary for the session)
$env:ALCHEMY_API_KEY = "YOUR_ALCHEMY_KEY"; npx hardhat node
```

Once the forked node is running in a separate terminal, run the test script in this repository's root (tests will connect to the local network):

```powershell
npm run test
```

Replace `YOUR_ALCHEMY_KEY` with your actual Alchemy API key. Keep the forked node running while running tests or deploy scripts that expect the fork.

### Quick run (concise)

Run deploy:

```powershell
npm run deploy
```

Run tests (start a forked Hardhat node first):

```powershell
# In separate terminal: npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
npm run test
```
