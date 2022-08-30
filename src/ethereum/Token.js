
import { ethers } from "ethers";
const { abi } = require('../../artifacts/contracts/ERC20Contract.sol/ERC20Contract.json');

export default (signerOrProvider, address) => {
    return new ethers.Contract(address,
        abi, signerOrProvider);
};