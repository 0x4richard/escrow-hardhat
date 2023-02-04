import { ethers } from "ethers";
import EscrowContract from "./artifacts/contracts/Escrow.sol/Escrow.json";

const useContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const getContractByAddress = (contractAddress) => {
    return new ethers.Contract(contractAddress, EscrowContract.abi, provider);
  };

  const getAccount = async () => {
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0];
  };

  return { getContractByAddress, getAccount, provider };
};

export default useContract;
