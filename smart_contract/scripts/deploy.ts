import { ethers } from "hardhat";




const main = async () => {
const Transactions = await ethers.getContractFactory("Transactions");
const transactions = await Transactions.deploy();

console.log(`Transactions contract deployed to: ${transactions.address}`);
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