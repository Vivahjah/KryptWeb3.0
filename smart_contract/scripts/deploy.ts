import { ethers } from "hardhat";




const main = async () => {
const Transactions = await ethers.getContractFactory("Transactions");
const transactions = await Transactions.deploy();
await transactions.waitForDeployment();
 const address = await transactions.getAddress();


 console.log(`Transaction ${address}`);




  // Deployment logic goes here
}



const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};



runMain()

//0x59D608e9d3DF2F89771CfcC91AE334E78cCD8385