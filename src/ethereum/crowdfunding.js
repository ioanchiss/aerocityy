import { ethers } from "ethers";

const { abi } = require('../../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json');

export default (signerOrProvider, address) => {
    return new ethers.Contract(address,
        abi, signerOrProvider);
};