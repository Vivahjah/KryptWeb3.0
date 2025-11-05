/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */



import React, { useEffect, useState, createContext } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constant";
import { toast } from "sonner";







export const TransactionContext = createContext<any>(null);







const getEthereumContract = async (): Promise<ethers.Contract> => {





    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;




};


export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState<string | null>(null);
    const [transactions, setTransactions] = useState<Array<any>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [transactionCount, setTransactionCount] = useState(
        localStorage.getItem("transactionCount") ? Number(localStorage.getItem("transactionCount")) : 0
    );
    const [formData, setFormData] = useState({
        addressTo: '',
        amount: '',
        keyword: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }
    //check if user has metamask installed
    const checkIfWalletIsConnected = async () => {

        try {

            if (!window.ethereum) {
                toast.error("Please install MetaMask");
                return;
            }

            const accounts = await window.ethereum.request({ method: "eth_accounts" });

            // if account is found set it to current account
            if (accounts.length) {
                fetchAllTransactions();
                setCurrentAccount(accounts[0]);

                //get all transactions here
            }
            else {
                console.log("No accounts found");
            }

            console.log({ accounts });


        } catch (error) {
            console.error(error);

        }

    };

    const checkIfTransactionsExists = async () => {
        try {
            const transactionContract = await getEthereumContract();
            const transactionsCount = await transactionContract.getTransactionCount();
            window.localStorage.setItem("transactionCount", transactionsCount.toString());
        } catch (error) {
            toast.error("An error occurred while checking transactions");
            console.error(error);
        }
    };

    const fetchAllTransactions = async () => {
        try {
            if (!window.ethereum) {
                toast.error("Please install MetaMask");
                return;
            }
            const transactionContract = await getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();
            console.log({availableTransactions});
           
            const structuredTransactions = availableTransactions.map((transaction: any) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(Number(transaction.timestamp) * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: ethers.formatEther(transaction.amount),
            }));
            setTransactions(structuredTransactions);
            console.log({structuredTransactions});
        } catch (error) {
            console.error(error);
        }
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                toast.error("Please install MetaMask");
                return;
            }
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);
            console.log({ accounts });
        } catch (error) {
            throw new Error("Cannot connect to wallet");
            toast.error("An error occurred while connecting the wallet");
            console.error(error);
        }
    };

    const sendTransaction = async () => {
        try {
            if (!window.ethereum) {
                toast.error("Please install MetaMask");
                return;
            }
            const transactionContract = await getEthereumContract();
            const parsedAmount = ethers.parseEther(formData.amount);

            await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: formData.addressTo,
                    gas: "0x5208", // 21000
                    value: '0x' + parsedAmount.toString(16) // convert bigint wei to hex string
                }]
            });

            //store transaction on blockchain
            const transactionHash = await transactionContract.addToBlockchain(
                formData.addressTo,
                parsedAmount,
                formData.message,
                formData.keyword
            );


            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait(); //wait for transaction to be mined
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionsCount = await transactionContract.getTransactionCount();
            console.log({ transactionsCount }); // Shows 12n in console, but the value is BigInt(12)

            const numericValue = Number(transactionsCount.toString()); // This gives you 12 as a number
            console.log({ numericValue }); // Shows 12
            setTransactionCount(numericValue);
            localStorage.setItem("transactionCount", numericValue.toString());


            toast.success("Transaction successful");
            setFormData({
                addressTo: '',
                amount: '',
                keyword: '',
                message: ''
            });



        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExists();
        fetchAllTransactions();
    }, []);

    return (
        <TransactionContext.Provider value={{ transactions, transactionCount, getEthereumContract, connectWallet, currentAccount, formData, setFormData, isLoading, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
};
