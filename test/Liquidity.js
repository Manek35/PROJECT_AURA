const {expect}=require("chai");
const {ethers, network}=require("hardhat");

const DAI="0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDC="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAI_WHALE="0x97f991971a37D4Ca58064e6a98FC563F03A71E5c";
const USDC_WHALE="0x37305B1cD40574E4C5Ce33f8e8306Be057fD7341";

describe("LiquidityExample",()=>{
    let liquidityExample;
    let accounts;
    let dai;
    let usdc;

    before(async()=>{
        accounts=await ethers.getSigners(1);
        const LiquidityExample=await ethers.getContractFactory("LiquidityExp");
        liquidityExample=await LiquidityExample.deploy();
        await liquidityExample.deployed();
        dai=await ethers.getContractAt("IERC20",DAI);
        usdc=await ethers.getContractAt("IERC20",USDC);
        await network.provider.request({
            method:"hardhat_impersonateAccount",
            params:[DAI_WHALE],
        });
        await network.provider.request({
            method:"hardhat_impersonateAccount",
            params:[USDC_WHALE],
        });
        const daiWhale=await ethers.getSigner(DAI_WHALE);
        const usdcWhale=await ethers.getSigner(USDC_WHALE);

        const [deployer] = accounts;
        await deployer.sendTransaction({ to: daiWhale.address, value: ethers.utils.parseEther("1") });
        await deployer.sendTransaction({ to: usdcWhale.address, value: ethers.utils.parseEther("1") });


        const daiAmount=80n*10n**17n;
        const usdcAmount=30n*10n**13n;

        const daiBal=await dai.balanceOf(daiWhale.address);
        const usdcBal=await usdc.balanceOf(usdcWhale.address);
        console.log(daiBal,usdcBal,daiAmount,usdcAmount);

        expect(await dai.balanceOf(daiWhale.address)).to.gte(daiAmount);
        expect(await usdc.balanceOf(usdcWhale.address)).to.gte(usdcAmount);
        console.log("Assertion success",accounts[0].address);
        await dai.connect(daiWhale).transfer(accounts[0].address,daiAmount);
        console.log("Dai transfered");
        await usdc.connect(usdcWhale).transfer(accounts[0].address,usdcAmount);
        console.log("Usdc transfered");
    });

    it("mintNewPosition",async()=>{
        const daiAmount=80n*10n**17n;
        const usdcAmount=30n*10n**13n;
        await dai.connect(accounts[0]).transfer(liquidityExample.address,daiAmount);
        await usdc.connect(accounts[0]).transfer(liquidityExample.address,usdcAmount);     
        console.log("funds transferd to contract");
        // await dai.connect(accounts[0]).approve(liquidityExample.address, daiAmount);
        // await usdc.connect(accounts[0]).approve(liquidityExample.address, usdcAmount);

        await liquidityExample.mintNewPosition();

        console.log("Dai balance:",await dai.balanceOf(accounts[0].address));
        console.log("Usdc balance:",await usdc.balanceOf(accounts[0].address));
    });
});