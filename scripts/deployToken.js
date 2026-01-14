const { ethers } = require("hardhat");

async function main() {
    const [owner,signer2] = await ethers.getSigners();

    Shoaib = await ethers.getContractFactory("Shoaib",owner);
    shoaib = await Shoaib.deploy();

    Rayyan = await ethers.getContractFactory("Rayyan",owner);
    rayyan = await Rayyan.deploy();

    PopUp = await ethers.getContractFactory("PopUp",owner);
    popUp = await PopUp.deploy();

    await shoaib.connect(owner).mint(signer2.address,ethers.utils.parseEther("100000"));
    await rayyan.connect(owner).mint(signer2.address,ethers.utils.parseEther("100000"));
    await popUp.connect(owner).mint(signer2.address,ethers.utils.parseEther("100000"));

    console.log("shoaib address=",`${shoaib.address}`);
    console.log("rayyan address=",`${rayyan.address}`);
    console.log("popUp address=",`${popUp.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });