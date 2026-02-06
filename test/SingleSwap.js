const {ethers}=require("hardhat");

const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; 
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; 
const DAI_WHALE = "0x97f991971a37D4Ca58064e6a98FC563F03A71E5c"; 
const USDC_WHALE = "0x97f991971a37D4Ca58064e6a98FC563F03A71E5c";
const SHOAIB="0x70FD86A7553F074f9C5fB0aBB50225D0cCB3E9Ae";
const POPUP="0x9b85077bfb4f984a1df562dAEE5fb1Af10c102af";
const RAYYAN="0xb9509372d8229bF00d7283709ae1Ca5355b86C73";
const WETH9 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const router="0x04c9244b361145cc8f134F1113fe1A2be1F3e98f";
describe("SingleSwapToken",()=>{
    let singleSwapToken;
    let accounts;
    let weth;
    let dai;
    let usdc;
    let shoaib;
    let rayyan;
    let popUp;

    before(async()=>{
        accounts=await ethers.getSigners(1);
        const SingleSwapToken=await ethers.getContractFactory("SingleSwapToken");
        singleSwapToken= await SingleSwapToken.deploy();
        weth= await ethers.getContractAt("IWETH",WETH9);
        dai= await ethers.getContractAt("IERC20",DAI);
        usdc= await ethers.getContractAt("IERC20",USDC);
        shoaib= await ethers.getContractAt("ERC20",SHOAIB);
        rayyan = await ethers.getContractAt("ERC20",RAYYAN);
        console.log(weth.address);
        console.log(dai.address);
        console.log(usdc.address);
    });
    // it("swapExactInputSingle",async()=>{
    //     const amountIn=10n**18n;
    //     console.log(accounts[0].address);
    //     console.log("Dai balance before",await dai.balanceOf(accounts[0].address));
    //     await weth.deposit({value:amountIn});
    //     console.log("Weth balance before",await weth.balanceOf(accounts[0].address));
    //     await weth.approve(singleSwapToken.address,amountIn);
    //     await singleSwapToken.swapExactInputSingle(weth.address,dai.address,amountIn);
    //     console.log("Dai balance",await dai.balanceOf(accounts[0].address));
        
    //     // console.log(weth);
    //     // console.log(dai);
    //     // console.log(usdc);
    // })
    it("swapExactInputSingle_SHO_RAY",async()=>{
        const amountIn=ethers.utils.parseUnits("5", 18);
        console.log(accounts[0].address);
        console.log("Rayyan balance before",await rayyan.balanceOf(accounts[0].address));
        //await weth.deposit({value:amountIn});
        console.log("Shoaib balance before",await shoaib.balanceOf(accounts[0].address));
        await shoaib.approve(singleSwapToken.address,amountIn);
        await singleSwapToken.swapExactInputSingle(router,shoaib.address,rayyan.address,amountIn,500,{
            gasLimit:1000000
        });
        console.log(" Rayyan Balance after",await rayyan.balanceOf(accounts[0].address));
        
    })
    // it("swapExactOutputSingle",async()=>{
    //     const wethAmountInMax=10n**18n;
    //     const daiAmountOut=100n*10n**18n;

    //     await weth.deposit({value:wethAmountInMax});
    //     await weth.approve(singleSwapToken.address,wethAmountInMax);
    //     console.log("approved");
    //     console.log("Weth balance before",await weth.balanceOf(accounts[0].address));
    //     await singleSwapToken.swapExactOutputSingle(weth.address,dai.address,daiAmountOut,wethAmountInMax);
    //     console.log(accounts[0].address);
    //     console.log("Dai balance",await dai.balanceOf(accounts[0].address));
    // });
});