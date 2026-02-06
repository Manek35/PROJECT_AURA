import deployments from "../scripts/deploymentdata.json";
import {ethers,BigNumber} from "ethers";
import {axios} from "axios";
import Web3Model from "web3modal";

const bn = require("bignumber.js");
bn.config({EXPONENTIAL_AT:999999,DECIMAL_PLACES:40});

const UNISWAP_V3_FACTORY_ADDRESS=deployments.factory;
const NON_FUNGIBLE_MANAGER=deployments.nonfungiblePositionManager;

const artifacts={
    UniswapV3Factory:require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"),
    NonfungiblePositionManager:require("@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json")
};

export const fetchPoolContract = (signerOrProvider)=>
    new ethers.Contract(
        UNISWAP_V3_FACTORY_ADDRESS,
        artifacts.UniswapV3Factory.abi,
        signerOrProvider
    );

export const fetchPositionContract=(signerOrProvider)=>
    new ethers.Contract(
        NON_FUNGIBLE_MANAGER,
        artifacts.NonfungiblePositionManager.abi,
        signerOrProvider
    );

const encodePriceSqrt = (reserve1,reserve0) =>
{
    return BigNumber.from(
        new bn(reserve1.toString())
        .div(reserve0.toString())
        .sqrt()
        .multipliedBy(new bn(2).pow(96))
        .integerValue(3)
        .toString()
    );
};

export const connectingWithPoolContract = async (
    address1,
    address2,
    fee,
    tokenfee1,
    tokenfee2
)=>{
    const web3Model = new Web3Model();
    const connection = await web3Model.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const [token0, token1] =
    address1.toLowerCase() < address2.toLowerCase()
      ? [address1, address2]
      : [address2, address1];

    console.log(signer);

    const createPoolContract = await fetchPositionContract(signer);

    const price = encodePriceSqrt(tokenfee1,tokenfee2);
    console.log(price);
    const transaction = await createPoolContract
                .connect(signer)
                .createAndInitializePoolIfNecessary(token0,token1,fee,price,{
                    gasLimit:5000000,
                });
    console.log("transaction");
    await transaction.wait();
    const factory = await fetchPoolContract(signer);
    const poolAddress = await factory.getPool(address1,address2,fee);

    return poolAddress;
}