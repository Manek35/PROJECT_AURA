import React,{useState,useEffect, Children} from 'react'
import { ethers,BigNumber} from 'ethers';
import Web3Model from "web3modal";
import {Token,CurrencyAmount,TradeType,Percent} from "@uniswap/sdk-core";

import{
    checkIfWalletConnected,
    connectWallet,
    connectingWithBooCoin,
    connectingWithAuraCoin,
    connectingWithDAI,
    connectingWithWETH,
    connectingWithSingleSwapToken,
} from "../Utils/appFeatures";
import {
    BooCoinAddress,
    AuraCoinAddress,
    IWETHAddress,
} from "./constants";
import {IWETHABI} from "./constants";
import ERC20 from "./ERC20.json";
import { getPrice } from "../Utils/fetchingPrice";
import { swapUpdatePrice } from "../Utils/swapUpdatePrice";

export const SwapTokenContext=React.createContext();
export const SwapTokenContextProvider=({children})=>{
    const swap="welcome to swap my token";

    const [account,setAccount]=useState("");
    const [ether,setEther]=useState("");
    const [networkConnect,setNetworkConnect]=useState("");
    const [weth9,setWeth9]=useState("");
    const [dai,setDai]=useState("");
    const [tokenData,setTokenData]=useState([]);

    const addToken=[
        BooCoinAddress,
        AuraCoinAddress,
        IWETHAddress,
        "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", 
        "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", 
        "0x6B175474E89094C44Da98b954EedeAC495271d0F", 
        "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", 
        //"0x4278C5d322aB92F1D876Dd7Bd9b44d1748b88af2", 
        //"0x0D92d35D311E54aB8EEA0394d7E773Fc5144491a", 
        //"0x24EcC5E6EaA700368B8FAC259d3fBD045f695A08",
    ];
    const fetchData=async()=>{
        try{
            const userAccount=await checkIfWalletConnected();
            setAccount(userAccount);
            //console.log(userAccount);
            const web3modal=new Web3Model();
            const connection =await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const balance=await provider.getBalance(userAccount);
            const convtBalance=BigNumber.from(balance).toString();
            const ethValue=ethers.utils.formatEther(convtBalance);
            setEther(ethValue);
            //console.log(ethValue);
            // addToken.map((el,i)=>{
            //     console.log(i,el);
            // });
            const network=await provider.getNetwork();
            setNetworkConnect(network.name);
            //console.log(network);
            const tokens = await Promise.all(
      addToken.map(async (address) => {
        const contract = new ethers.Contract(address, ERC20, provider);
        const userBalance = await contract.balanceOf(userAccount);
        const decimals = await contract.decimals();
        //const balance = ethers.utils.formatEther(userBalance);
        const symbol = await contract.symbol();
        const name = await contract.name();

        return {
          name:name,
          symbol:symbol,
          tokenBalance: ethers.utils.formatUnits(userBalance, decimals),
          tokenAddress:address,
        };
      })
    );

            setTokenData(tokens); 
            const weth=await connectingWithWETH();
            const wethBal=await weth.balanceOf(userAccount);
            const wethToken=BigNumber.from(wethBal).toString();
            const convertwethTokenBal=ethers.utils.formatEther(wethToken);
            //console.log(convertwethTokenBal);
            setWeth9(convertwethTokenBal);

            const dai=await connectingWithDAI();
            const daiBal=await dai.balanceOf(userAccount);
            const daiToken=BigNumber.from(daiBal).toString();
            const convertdaiTokenBal=ethers.utils.formatEther(daiToken);
            setDai(convertdaiTokenBal);
            //console.log(convertdaiTokenBal);
        
                }
        catch(error)
        {
            console.log(error);
        }
    }
    useEffect(()=>{
        fetchData()
    },[]);
    useEffect(() => {
  console.log("tokenData updated:", tokenData);
}, [tokenData]);

    const singleSwapToken=async({token1,token2,swapAmount})=>{
        console.log(
            token1.tokenAddress.tokenAddress,
            token2.tokenAddress.tokenAddress,
            swapAmount
        )
        try{
            let singleSwapToken;
            let dai;
            let weth;
            singleSwapToken=await connectingWithSingleSwapToken();
            weth=await connectingWithWETH();
            dai=await connectingWithDAI();
            console.log(weth.address);
            const deecimal0=18;
            const inputAmount=swapAmount;
            const amountIn=ethers.utils.parseUnits(
                inputAmount.toString(),
                deecimal0
            );

            console.log(amountIn);
            
            await weth.deposit({value:amountIn});
            await weth.approve(singleSwapToken.address,amountIn);
            const transaction =await singleSwapToken.swapExactInputSingle(
                token1.tokenAddress.tokenAddress,
                token2.tokenAddress.tokenAddress,
                amountIn,
                {
                    gasLimit:300000
                }
            );
            await transaction.waith();
            const balance=await dai.balanceOf(account);
            const transferAmount=BigNumber.from(balance).toString();
            const ethValue=ethers.utils.formatEther(transferAmount);
            setDai(ethValue);
            console.log(ethValue)
        }
        catch(error)
        {
            console.log(error);
        }
    }
    return (
        <SwapTokenContext.Provider value={{singleSwapToken,connectWallet,getPrice,swapUpdatePrice,account,weth9,dai,networkConnect,ether,tokenData}}>{children}</SwapTokenContext.Provider>
    );
};