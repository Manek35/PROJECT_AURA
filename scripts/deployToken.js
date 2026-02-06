const { ethers } = require("hardhat");
fs = require("fs");

async function main() {
    const [owner,signer2] = await ethers.getSigners();

    Shoaib = await ethers.getContractFactory("Shoaib");
    shoaib = await Shoaib.deploy();

    Rayyan = await ethers.getContractFactory("Rayyan");
    rayyan = await Rayyan.deploy();

    PopUp = await ethers.getContractFactory("PopUp");
    popUp = await PopUp.deploy();

    console.log("shoaib address=",`${shoaib.address}`);
    console.log("rayyan address=",`${rayyan.address}`);
    console.log("popUp address=",`${popUp.address}`);

    const deploymentdata ={};
        deploymentdata.shoaib=shoaib.address;
        deploymentdata.popUp=popUp.address;
        deploymentdata.rayyan=rayyan.address;
        fs.writeFileSync(
                "scripts/tokendata.json",
                JSON.stringify(deploymentdata, null, 2)
            );
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });