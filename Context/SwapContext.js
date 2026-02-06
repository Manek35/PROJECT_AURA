import React, { useState, useEffect, Children } from "react";
import images from "../assets";
import { ethers, BigNumber } from "ethers";
import Web3Model from "web3modal";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";

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
import axios from "axios";

export const SwapTokenContext = React.createContext();
export const SwapTokenContextProvider = ({ children }) => {
  const swap = "welcome to swap my token";

  const [account, setAccount] = useState("");
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
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    //"0x4278C5d322aB92F1D876Dd7Bd9b44d1748b88af2",
    //"0x0D92d35D311E54aB8EEA0394d7E773Fc5144491a",
    //"0x24EcC5E6EaA700368B8FAC259d3fBD045f695A08",
  ];
  const fetchData = async () => {
    try {
      const userAccount = await checkIfWalletConnected();
      setAccount(userAccount);
      //console.log(userAccount);
      const web3modal = new Web3Model();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const balance = await provider.getBalance(userAccount);
      const convtBalance = BigNumber.from(balance).toString();
      const ethValue = ethers.utils.formatEther(convtBalance);
      setEther(ethValue);
      //console.log(ethValue);
      // addToken.map((el,i)=>{
      //     console.log(i,el);
      // });
      const network = await provider.getNetwork();
      setNetworkConnect(network.name);
      console.log(network);
      const tokens = await Promise.all(
        addToken.map(async (address) => {
          const contract = new ethers.Contract(address, ERC20, provider);
          const userBalance = await contract.balanceOf(userAccount);
          const decimals = await contract.decimals();
          //console.log(ethers.utils.formatUnits(userBalance, decimals));
          //const balance = ethers.utils.formatEther(userBalance);
          const symbol = await contract.symbol();
          const name = await contract.name();
          
          // Determine Image
          let tokenImage = images.uniswap; // Default for custom tokens
          
          // External Images
          const TOKEN_IMAGES = {
            "0xdAC17F958D2ee523a2206206994597C13D831ec7": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png", // USDT
            "0xB8c77482e45F1F44dE1745F52C74426C631bDD52": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xB8c77482e45F1F44dE1745F52C74426C631bDD52/logo.png", // BNB
            "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png", // MATIC
            "0x6B175474E89094C44Da98b954EedeAC495271d0F": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png", // DAI
            "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png", // SHIB
            [AuraCoinAddress]: images.aura,
          };

          if(TOKEN_IMAGES[address]){
              tokenImage = TOKEN_IMAGES[address];
          } else if(address === IWETHAddress){
              tokenImage = images.etherlogo;
          }

          return {
            name: name,
            symbol: symbol,
            tokenBalance: ethers.utils.formatUnits(userBalance, decimals),
            tokenAddress: address,
            img: tokenImage
          };
        }),
      );

      setTokenData(tokens);

      const userStorageData = await connectingWithUserStorageContract();
      const userLiquidity = await userStorageData.getAllTransactions();
      console.log("userstorage", userLiquidity);

      const liquidityResults = await Promise.all(
        userLiquidity.map(async (el) => {
          return await getLiquidityData(
            el.poolAddress,
            el.tokenAddress0,
            el.tokenAddress1,
          );
        }),
      );
      setGetAllLiquidity(liquidityResults);

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

      const weth = await connectingWithWETH();
      const wethBal = await weth.balanceOf(userAccount);
      const wethToken = BigNumber.from(wethBal).toString();
      const convertwethTokenBal = ethers.utils.formatEther(wethToken);
      //console.log(convertwethTokenBal);
      setWeth9(convertwethTokenBal);

      const dai = await connectingWithDAI();
      const daiBal = await dai.balanceOf(userAccount);
      const daiToken = BigNumber.from(daiBal).toString();
      const convertdaiTokenBal = ethers.utils.formatEther(daiToken);
      setDai(convertdaiTokenBal);
      console.log(convertdaiTokenBal);
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
      );

      console.log(info);
      const userStorageData = await connectingWithUserStorageContract();
      const userLiquidity = await userStorageData.addToBlockchain(
        poolAddress,
        tokenAddress0,
        tokenAddress1,
      );
    } catch (error) {
      console.log(error);
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
      singleSwapToken = await connectingWithSingleSwapToken();
      weth = await connectingWithToken(token1.tokenAddress.tokenAddress);
      dai = await connectingWithToken(token2.tokenAddress.tokenAddress);
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
        getAllLiquidity,
        account,
        weth9,
        dai,
        networkConnect,
        ether,
        tokenData,
        topTokenList,
        router,
      }}
    >
      {children}
    </SwapTokenContext.Provider>
  );
};
