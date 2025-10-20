import {ethers} from "ethers";
import Web3Model from  "web3modal";

import {
    DAIAddress,
    BooCoinAddress,
    BooCoinABi,
    AuraCoinAddress,
    AuraCoinABi,
    SingleSwapTokenAddress,
    SingleSwapTokenABi,
    SwapMultiHopAddress,
    SwapMultiHopABi,
    IWETHAddress,
    IWETHABI,
} from "../Context/constants";

export const checkIfWalletConnected=async()=>{
    try{
        if(!window.ethereum)
            return console.log("Install MetaMask");
        const accounts=await window.ethereum.request({
            method:"eth_accounts",
        });
        const firstAccount=accounts[0];
        return firstAccount;
    }
    catch(error){
        console.log(error);
    }
}
export const connectWallet=async()=>{
    try{
        if(!window.ethereum)
            return console.log("Install MetaMask");
        const accounts=await window.ethereum.request({
            method:"eth_requestAccounts",
        });
        const firstAccount=accounts[0];
        return firstAccount;
    }
    catch(error){
        console.log(error);
    }
}

export const fetchBooContract =(singnerOrProvider)=> new ethers.Contract(BooCoinAddress,BooCoinABi,singnerOrProvider);

export const connectingWithBooCoin=async()=>
{
    try {
        const web3modal=new Web3Model();
        const connection =await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer=provider.getSigner();
        const contract=fetchBooContract(signer);
        return contract;
    } catch (error) {
        console.log(error);
    }
}

export const fetchAuraContract =(singnerOrProvider)=> new ethers.Contract(AuraCoinAddress,AuraCoinABi,singnerOrProvider);

export const connectingWithAuraCoin=async()=>
{
    try {
        const web3modal=new Web3Model();
        const connection =await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer=provider.getSigner();
        const contract=fetchAuraContract(signer);
        return contract;
    } catch (error) {
        console.log(error);
    }
}
export const fetchWETHContract =(singnerOrProvider)=> new ethers.Contract(IWETHAddress,IWETHABI,singnerOrProvider);

export const connectingWithWETH=async()=>
{
    try {
        const web3modal=new Web3Model();
        const connection =await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer=provider.getSigner();
        const contract=fetchWETHContract(signer);
        return contract;
    } catch (error) {
        console.log(error);
    }
}

export const fetchDAIContract =(singnerOrProvider)=> new ethers.Contract(DAIAddress,IWETHABI,singnerOrProvider);

export const connectingWithDAI=async()=>
{
    try {
        const web3modal=new Web3Model();
        const connection =await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer=provider.getSigner();
        const contract=fetchDAIContract(signer);
        return contract;
    } catch (error) {
        console.log(error);
    }
}


export const fetchSingleSwapTokenContract =(singnerOrProvider)=> new ethers.Contract(SingleSwapTokenAddress,SingleSwapTokenABi,singnerOrProvider);

export const connectingWithSingleSwapToken=async()=>
{
    try {
        const web3modal=new Web3Model();
        const connection =await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer=provider.getSigner();
        const contract=fetchSingleSwapTokenContract(signer);
        return contract;
    } catch (error) {
        console.log(error);
    }
}

export const fetchSwapMultiHopContract =(singnerOrProvider)=> new ethers.Contract(SwapMultiHopAddress,SwapMultiHopABi,singnerOrProvider);

export const connectingWithSwapMultiHop=async()=>
{
    try {
        const web3modal=new Web3Model();
        const connection =await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer=provider.getSigner();
        const contract=fetchSwapMultiHopContract(signer);
        return contract;
    } catch (error) {
        console.log(error);
    }
}
