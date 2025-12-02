import React,{useState,useEffect, Children} from 'react'
import { ethers,BigNumber} from 'ethers';
import Web3Model from "web3modal";

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
        const balance = ethers.utils.formatEther(userBalance);
        const symbol = await contract.symbol();
        const name = await contract.name();

        return {
          name,
          symbol,
          tokenBalance: balance,
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
    const singleSwapToken=async()=>{
        try{
            let singleSwapToken;
            let dai;
            let weth;
            singleSwapToken=await connectingWithSingleSwapToken();
            weth=await connectingWithWETH();
            dai=await connectingWithDAI();
            console.log(weth.address);
            const amountIn=10n**18n;
            
            await weth.deposit({value:amountIn});
            await weth.approve(singleSwapToken.address,amountIn);
            await singleSwapToken.swapExactInputSingle(amountIn,{gasLimit:300000});
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
        <SwapTokenContext.Provider value={{singleSwapToken,account,weth9,dai,networkConnect,ether,connectWallet,tokenData}}>{children}</SwapTokenContext.Provider>
    );
};