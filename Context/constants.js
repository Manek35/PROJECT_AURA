import booCoin from "./BooCoin.json";
import auraCoin from "./AuraCoin.json";
import singleSwapToken from "./SingleSwapToken.json";
import swapMultiHop from "./SwapMultiHop.json";
import IWETH from "./IWETH.json";
import UserStorageData from "./UserStorageData.json";
import deployment from "./address.json";
import tokens from "../scripts/tokendata.json";
import uniswap from "../scripts/deploymentdata.json";

// Token addresses
export const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
export const IWETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

// Contract addresses from deployment
export const BooCoinAddress = deployment.contracts.BooCoin;
export const AuraCoinAddress = deployment.contracts.AuraCoin;
export const SingleSwapTokenAddress = deployment.contracts.SingleSwapToken;
export const SwapMultiHopAddress = deployment.contracts.SwapMultiHop;
export const UserStorageDataAddress= deployment.contracts.UserStorageData;
export const ShoaibAddress=tokens.shoaib;
export const RayyanAddress=tokens.rayyan;
export const PopUpAddress=tokens.popUp;

// ABIs
export const BooCoinABI = booCoin.abi;
export const AuraCoinABI = auraCoin.abi;
export const SingleSwapTokenABI = singleSwapToken.abi;
export const SwapMultiHopABI = swapMultiHop.abi;
export const IWETHABI = IWETH.abi;
export const UserStorageDataABI =UserStorageData.abi;

export const router=uniswap.swaprouter;