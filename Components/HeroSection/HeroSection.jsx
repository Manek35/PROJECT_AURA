import React,{useState,useContext} from 'react'
import Image from "next/image";
import Style from "./HeroSection.module.css";
import images from "../../assets";
import {Token,SearchToken} from "../index";
import {SwapTokenContext} from "../../Context/SwapContext";
//import { connectWallet } from '@/Utils/appFeatures';
const HeroSection = ({tokenData}) => {
  const [openSetting,setOpenSetting]=useState(false);
  const [openToken,setOpenToken]=useState(false);
  const [openTokenTwo,setOpenTokenTwo]=useState(false);
  const {singleSwapToken,connectWallet,account,weth9,dai,ether}=useContext(SwapTokenContext);
  //console.log(account);
  const [tokenOne,setTokenOne]=useState({
    name:"",
    image:"",
  });
  const [tokenTwo,setTokenTwo]=useState({
    name:"",
    image:"",
  });
  return (
    <div className={Style.HeroSection}>
      <div className={Style.HeroSection_box}>
        <div className={Style.HeroSection_box_heading}>
          <p>Swap</p>
          <div className={Style.HeroSection_box_heading_img}>
            <Image src={images.close} alt="image" width={50} height={50} onClick={()=> setOpenSetting(true)}/> 
          </div>
        </div>
        <div className={Style.HeroSection_box_input}>
          <input type="text" placeholder="0"/>
          <button onClick={()=>setOpenToken(true)}>
            <Image src={images.image || images.etherlogo} width={20} height={20} alt="ether"/>
            {tokenOne.name||"ETH"}
            <small>{ether.slice(0,7)}</small>
          </button>
        </div>
        <div className={Style.HeroSection_box_input}>
          <input type="text" placeholder="0"/>
          <button onClick={()=>setOpenTokenTwo(true)}>
            <Image src={tokenTwo.image || images.etherlogo} width={20} height={20} alt="ether"/>
            {tokenTwo.name||"ETH"}
            <small>{dai.slice(0,7)}</small>
          </button>
        </div>
        {
          account ?(
            <button className={Style.HeroSection_box_btn} onClick={()=>singleSwapToken()}>Swap</button>
          ):(
            <button className={Style.HeroSection_box_btn} onClick={()=>(console.log("clicked"),connectWallet())}>Connect Wallet</button>
          )
        }
      </div>
      {openSetting && <Token setOpenSetting={setOpenSetting}/>}
      {openToken && (
        <SearchToken setOpenToken={setOpenToken} tokens={setTokenOne} tokenData={tokenData}/>
      )}
      {openTokenTwo && (
        <SearchToken setOpenToken={setOpenTokenTwo} tokens={setTokenTwo} tokenData={tokenData}/>
      )}
    </div>
  )
}

export default HeroSection