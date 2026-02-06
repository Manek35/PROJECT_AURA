const axios= require("axios");
const ETHERSCAN_API_KEY="XNU2Q246329NTTV11STPTMHPKJS5GXE5VE";
//require("dotenv").config();

const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

exports.getAbi = async(address)=>{
    const url=`https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
    try {
        const res = await axios.get(url);
        // Check for Etherscan error status or if result is not a valid string for JSON.parse
        if (res.data.status === "0" || typeof res.data.result !== 'string') {
             console.warn("Etherscan API error or rate limit, using fallback ABI:", res.data.message);
             return ERC20_ABI;
        }
        
        const abi = JSON.parse(res.data.result);
        return abi;
    } catch (error) {
        console.error("Failed to fetch or parse ABI, using fallback:", error);
        return ERC20_ABI;
    }
}

exports.getPoolImmutables = async(poolContract)=>{
    const [token0,token1,fee] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee()
    ])

    const immutables = {
        token0:token0,
        token1:token1,
        fee:fee
    }

    return immutables;
}