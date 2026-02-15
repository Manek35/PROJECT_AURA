import React, { useState, useEffect, Children } from "react";
import images from "../assets";
import { ethers, BigNumber } from "ethers";
import Web3Model from "web3modal";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";

// import { connectingWithUserStorageContract } from "../Utils/appFeatures"; // We might not need this for reading anymore, but keeping for writing
import {
  checkIfWalletConnected,
  connectWallet,
  connectingWithBooCoin,
  connectingWithAuraCoin,
  connectingWithDAI,
  connectingWithWETH,
  connectingWithSingleSwapToken,
  connectingWithUserStorageContract,
  connectingWithToken,
} from "../Utils/appFeatures";
import {
  BooCoinAddress,
  AuraCoinAddress,
  IWETHAddress,
  ShoaibAddress,
  RayyanAddress,
  PopUpAddress,
  router,
} from "./constants";
import { IWETHABI } from "./constants";
import ERC20 from "./ERC20.json";
import { getPrice } from "../Utils/fetchingPrice";
import { swapUpdatePrice } from "../Utils/swapUpdatePrice";
import { addLiquidityExternal } from "../Utils/addLiquidity";
import { getLiquidityData } from "../Utils/checkLiquidity";
import { connectingWithPoolContract } from "@/Utils/deployPool";
import { removeLiquidity, collectFees } from "@/Utils/removeLiquidity";
import axios from "axios";

import deploymentdata from "../scripts/deploymentdata.json";

export const SwapTokenContext = React.createContext();
export const SwapTokenContextProvider = ({ children }) => {
  const swap = "welcome to swap my token";

  const [account, setAccount] = useState("");
  const [signer,setSigner]=useState("");
  const [provider,setProvider]=useState("");
  const [ether, setEther] = useState("");
  const [networkConnect, setNetworkConnect] = useState("");
  const [weth9, setWeth9] = useState("");
  const [dai, setDai] = useState("");
  const [tokenData, setTokenData] = useState([]);
  const [getAllLiquidity, setGetAllLiquidity] = useState([]);
  const [topTokenList, setTopTokenList] = useState([]);

  const addToken = [
    BooCoinAddress,
    AuraCoinAddress,
    IWETHAddress,
    ShoaibAddress,
    RayyanAddress,
    PopUpAddress,
    "0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6",//sepolia DAI
    "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",//Sepolia USDC
    // "0xdAC17F958D2ee523a2206206994597C13D831ec7",//USDC
    // "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    // "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    // "0x6B175474E89094C44Da98b954EedeAC495271d0F",// DAI
    // "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    //"0x4278C5d322aB92F1D876Dd7Bd9b44d1748b88af2",
    //"0x0D92d35D311E54aB8EEA0394d7E773Fc5144491a",
    //"0x24EcC5E6EaA700368B8FAC259d3fBD045f695A08",
  ];
  const fetchData = async () => {
    try {
      const web3Model = new Web3Model();
      const connection = await web3Model.connect();
      const customNetwork = {
      chainId: `0x${(11155111).toString(16)}`, // Sepolia ID in Hex
      chainName: "Sepolia Testnet",
      nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
      rpcUrls: [`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`], // Your Private RPC
      blockExplorerUrls: ["https://sepolia.etherscan.io"],
      };
      await connection.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: customNetwork.chainId }],
        });
      const Provider = new ethers.providers.Web3Provider(connection);
      const Signer = Provider.getSigner();
      const userAccount = await checkIfWalletConnected();
      setAccount(userAccount);
      setProvider(Provider);
      setSigner(Signer);
      console.log(userAccount,Signer,Provider);
      const balance = await Provider.getBalance(userAccount);
      const convtBalance = BigNumber.from(balance).toString();
      const ethValue = ethers.utils.formatEther(convtBalance);
      setEther(ethValue);
      console.log(balance);
      // addToken.map((el,i)=>{
      //     console.log(i,el);
      // });
      const network = await Provider.getNetwork();
      // setNetworkConnect(network.name);
      setNetworkConnect(network);
      console.log(network);
      const tokens = await Promise.all(
        addToken.map(async (address) => {
          const checkCode = await Provider.getCode(address);
      if (checkCode === "0x" || checkCode === "0x0") {
        console.warn(`No contract at ${address}. Skipping.`);
        return null; 
      }
          const contract = new ethers.Contract(address, ERC20, Provider);
          const [userBalance, decimals, symbol, name] = await Promise.all([
                contract.balanceOf(userAccount),
                contract.decimals(),
                contract.symbol(),
                contract.name()
              ]);

          // Determine Image
          let tokenImage = images.uniswap; // Default for custom tokens

          // External Images
          const TOKEN_IMAGES = {
            "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238":
              "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png", // USDT
            "0xB8c77482e45F1F44dE1745F52C74426C631bDD52":
              "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB8c77482e45F1F44dE1745F52C74426C631bDD52/logo.png", // BNB
            "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0":
              "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png", // MATIC
            "0x3e622317f8C93f7328350cF0B56d9eD4C620C5d6":
              "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png", // DAI
            "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE":
              "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png", // SHIB
            [AuraCoinAddress]: images.aura,
          };

          if (TOKEN_IMAGES[address]) {
            tokenImage = TOKEN_IMAGES[address];
          } else if (address === IWETHAddress) {
            tokenImage = images.etherlogo;
          }

          return {
            name: name,
            symbol: symbol,
            decimals: decimals,
            tokenBalance: ethers.utils.formatUnits(userBalance, decimals),
            tokenAddress: address,
            img: tokenImage,
          };
        }),
      );

      setTokenData(tokens);

      // 1. Get position manager contract
      const positionManager = new ethers.Contract(
        deploymentdata.nonfungiblePositionManager,
        require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json").abi,
        Provider
      );

      // 2. Get number of NFTs owned by user
      const nftBalance = await positionManager.balanceOf(userAccount);
      console.log("User has NFTs:", nftBalance.toString());

      // 3. fetch all token IDs
      const tokenIds = [];
      for (let i = 0; i < nftBalance.toNumber(); i++) {
        const tokenId = await positionManager.tokenOfOwnerByIndex(userAccount, i);
        tokenIds.push(tokenId);
      }

      // 4. Fetch data for each token ID
      const liquidityResults = await Promise.all(
        tokenIds.map(async (tokenId) => {
          // We need to fetch basic info like token addresses from the position itself
          const positionInfo = await positionManager.positions(tokenId);
          
          if (positionInfo.liquidity.eq(0)) {
             const hasDust = positionInfo.tokensOwed0.gt(0) || positionInfo.tokensOwed1.gt(0);
             if (!hasDust) {
               return null;
             }
          }

           // Re-use logic from checkLiquidity, but we might need to adjust arguments since we don't have el.poolAddress handy immediately
           // Actually `getLiquidityData` in checkLiquidity takes (poolAddress, token1, token2, tokenId, provider)
           // We need to find poolAddress etc from the position info.
           // BUT `getLiquidityData` calculates poolAddress internally if we only had the tokens and fee?
           // No, `getLiquidityData` signature is: (poolAddress, token1Address, token2Address, tokenId, provider)
           
           // We need to derive pool address. Factory + tokens + fee.
           // or we can just update `getLiquidityData` to work with just TokenID? 
           // Let's rely on the fact that `UserStorage` is broken and we need to do it the hard way or 
           // use a helper. 
           
           // Let's modify `getLiquidityData` in Utils/checkLiquidity.js to be smarter, 
           // OR calculate it here. 
           
           // To calculate Pool Address:
           // We can use the factory.getPool(token0, token1, fee)
           
           const factoryAddress = deploymentdata.factory;
           const factoryContract = new ethers.Contract(
              factoryAddress,
              require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json").abi,
              Provider
           );
           
           const token0 = positionInfo.token0;
           const token1 = positionInfo.token1;
           const fee = positionInfo.fee;
           
           const poolAddress = await factoryContract.getPool(token0, token1, fee);
           
           const data = await getLiquidityData(
             poolAddress,
             token0,
             token1,
             tokenId,
             Provider
           );
           
           return {
               ...data,
               tokenId: tokenId.toString()
           }
        })
      );
      setGetAllLiquidity(liquidityResults.filter(el => el !== null));
      console.log(liquidityResults.length)
      const URL =
        "https://gateway.thegraph.com/api/5f704218070c5797b1928dd757cd63a0/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV";

      const query = `
            {
            tokens(orderBy: volumeUSD, orderDirection: desc, first: 20) {
                id
                name
                symbol
                decimals
                volume
                volumeUSD
                totalSupply
                feesUSD
                txCount
                poolCount
                totalValueLockedUSD
                totalValueLocked
                derivedETH
            }
            }
            `;
      const axiosData = await axios.post(URL, { query: query });
      console.log(axiosData);
      console.log(axiosData.data.data.tokens);
      setTopTokenList(axiosData.data.data.tokens);

      // const weth = await connectingWithWETH();
      // const wethBal = await weth.balanceOf(userAccount);
      // const wethToken = BigNumber.from(wethBal).toString();
      // const convertwethTokenBal = ethers.utils.formatEther(wethToken);
      // //console.log(convertwethTokenBal);
      // setWeth9(convertwethTokenBal);

      // const dai = await connectingWithDAI();
      // const daiBal = await dai.balanceOf(userAccount);
      // const daiToken = BigNumber.from(daiBal).toString();
      // const convertdaiTokenBal = ethers.utils.formatEther(daiToken);
      // setDai(convertdaiTokenBal);
      // console.log(convertdaiTokenBal);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    console.log("tokenData updated:", tokenData);
  }, [tokenData]);

  const createLiquidityAndPool = async ({
    tokenAddress0,
    tokenAddress1,
    fee,
    tokenPrice1,
    tokenPrice2,
    slippage,
    deadline,
    tokenAmount0,
    tokenAmount1,
  }) => {
    try {
      console.log(
        tokenAddress0,
        tokenAddress1,
        fee,
        tokenPrice1,
        tokenPrice2,
        slippage,
        deadline,
        tokenAmount0,
        tokenAmount1,
      );
      const createPool = await connectingWithPoolContract(
        tokenAddress0,
        tokenAddress1,
        fee,
        tokenPrice1,
        tokenPrice2,
        signer,
        {
          gasLimit: 500000,
        },
      );
      console.log("pool created");
      const poolAddress = createPool;
      console.log(poolAddress);
      const info = await addLiquidityExternal(
        tokenAddress0,
        tokenAddress1,
        poolAddress,
        fee,
        tokenAmount0,
        tokenAmount1,
        signer,
        provider
      );

      console.log(info);
      const userStorageData = await connectingWithUserStorageContract(signer);
      const userLiquidity = await userStorageData.addToBlockchain(
        poolAddress,
        tokenAddress0,
        tokenAddress1,
        account,
        info.tokenId
      );
      console.log("saved");
    } catch (error) {
      console.log(error);
    }
  };
  const removeLiquidityAndUpdateUserdata = async (tokenId) => {
    try {
      // 1. Perform Blockchain Transaction First
      const receipt = await removeLiquidity(tokenId, signer);
      
      // 2. Then Update User Storage (if needed for other reasons, though we now fetch from chain)
      const userStorageData = await connectingWithUserStorageContract(signer);
      await userStorageData.removeTransaction(tokenId);
      console.log("userdata updated");
      
      await fetchData(); // Refresh balances
      return receipt;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
  const collectFeesForUser = async (tokenId) => {
    try {
        const receipt = await collectFees(tokenId, signer);
        console.log("Fees collected");
        await fetchData(); // Refresh balances
        return receipt;
    } catch (e) {
        console.log(e);
        throw e;
    }
  };

  const singleSwapToken = async ({ token1, token2, swapAmount }) => {
    console.log(
      token1.tokenAddress.tokenAddress,
      token2.tokenAddress.tokenAddress,
      swapAmount,
    );
    try {
      let singleSwapToken;
      let dai;
      let weth;
      singleSwapToken = await connectingWithSingleSwapToken(signer);
      weth = await connectingWithToken(token1.tokenAddress.tokenAddress,signer);
      dai = await connectingWithToken(token2.tokenAddress.tokenAddress,signer);
      console.log(weth.address);
      const deecimal0 = 18;
      const inputAmount = swapAmount;
      const amountIn = ethers.utils.parseUnits(
        inputAmount.toString(),
        deecimal0,
      );

      console.log(amountIn);

      //await weth.deposit({value:amountIn});
      await weth.approve(singleSwapToken.address, amountIn);
      const transaction = await singleSwapToken.swapExactInputSingle(
        router,
        token1.tokenAddress.tokenAddress,
        token2.tokenAddress.tokenAddress,
        amountIn,
        3000,
        {
          gasLimit: 600000,
        },
      );
      await transaction.wait();
      const balance = await dai.balanceOf(account);
      const transferAmount = BigNumber.from(balance).toString();
      const ethValue = ethers.utils.formatEther(transferAmount);
      setDai(ethValue);
      console.log(ethValue);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SwapTokenContext.Provider
      value={{
        singleSwapToken,
        connectWallet,
        getPrice,
        swapUpdatePrice,
        createLiquidityAndPool,
        removeLiquidityAndUpdateUserdata,
        getAllLiquidity,
        account,
        weth9,
        dai,
        networkConnect,
        ether,
        tokenData,
        topTokenList,
        router,
        router,
        provider,
        collectFees: collectFeesForUser
      }}
    >
      {children}
    </SwapTokenContext.Provider>
  );
};
