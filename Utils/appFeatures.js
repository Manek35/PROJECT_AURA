import {ethers} from "ethers";
import Web3Model from  "web3modal";

import {
    DAIAddress,
    BooCoinAddress,
    BooCoinABI,
    AuraCoinAddress,
    AuraCoinABI,
    SingleSwapTokenAddress,
    SingleSwapTokenABI,
    SwapMultiHopAddress,
    SwapMultiHopABI,
    IWETHAddress,
    IWETHABI,
    UserStorageDataABI,
    UserStorageDataAddress,
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

export const fetchBooContract =(singnerOrProvider)=> new ethers.Contract(BooCoinAddress,BooCoinABI,singnerOrProvider);

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

export const fetchAuraContract =(singnerOrProvider)=> new ethers.Contract(AuraCoinAddress,AuraCoinABI,singnerOrProvider);

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

export const fetchTokenContract =(singnerOrProvider,tokenAddress)=> new ethers.Contract(tokenAddress,IWETHABI,singnerOrProvider);

export const connectingWithToken=async(tokenAddress)=>
{
    try {
        const web3modal=new Web3Model();
        const connection =await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer=provider.getSigner();
        const contract=fetchTokenContract(signer,tokenAddress);
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
        console.log("entered");
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


export const fetchSingleSwapTokenContract =(singnerOrProvider)=> new ethers.Contract(SingleSwapTokenAddress,SingleSwapTokenABI,singnerOrProvider);

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

export const fetchSwapMultiHopContract =(singnerOrProvider)=> new ethers.Contract(SwapMultiHopAddress,SwapMultiHopABI,singnerOrProvider);

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


export const fetchUserStorageDataContract =(singnerOrProvider)=> new ethers.Contract(UserStorageDataAddress,UserStorageDataABI,singnerOrProvider);

export const connectingWithUserStorageContract=async()=>
{
    try {
        console.log("entered");
        const web3modal=new Web3Model();
        const connection =await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer=provider.getSigner();
        const contract=fetchUserStorageDataContract(signer);
        return contract;
    } catch (error) {
        console.log(error);
    }
}
