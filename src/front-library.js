import { ethers } from "ethers";
import Crowdfunding from './ethereum/crowdfunding';
import USDT from './ethereum/USDT';
import RWD from './ethereum/Token';
export class FrontendLibrary {
    constructor(provider, crowdfundingAddress, USDTokenAddress, RWDTokenAddress) {
        this.provider = (provider) ? provider : new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
        this.crowdfundingAddress = crowdfundingAddress;
        this.crowdfundingContract = Crowdfunding(this.provider, this.crowdfundingAddress);
        this.USDTokenAddress = USDTokenAddress;
        this.RWDTokenAddress = RWDTokenAddress;
        this.USDTContract = USDT(this.provider, this.USDTokenAddress);
        this.RWDCOntract = RWD(this.provider, this.RWDTokenAddress);
    }
    async getCurrentPresaleGoal() {
        const currentPhase = await this.crowdfundingContract.getCurrentPhase();
        const costPerPresalePeriod = await this.crowdfundingContract.getGoal(currentPhase);
        return ethers.utils.formatUnits(costPerPresalePeriod, "ether");
    }
    async getCurrentPresaleCost() {
        const currentPhase = await this.crowdfundingContract.getCurrentPhase();
        const costPerPresalePeriod = await this.crowdfundingContract.getCost(currentPhase);
        return ethers.utils.formatUnits(costPerPresalePeriod, "ether");
    }
    async getCurrentPresaleBalance() {
        const currentPhase = await this.crowdfundingContract.getCurrentPhase();
        const balance = await this.crowdfundingContract.getBalance(currentPhase);
        return ethers.utils.formatUnits(balance, "ether");
    }
    async getCurrentPresaleStartTime() {
        const currentPhase = await this.crowdfundingContract.getCurrentPhase();
        const startPresale = await this.crowdfundingContract.getStartPresale(currentPhase);
        return startPresale;
    }
    async getCurrentPresaleEndTime() {
        const currentPhase = await this.crowdfundingContract.getCurrentPhase();
        const endPresale = await this.crowdfundingContract.getDeadline(currentPhase);
        return endPresale;
    }
    async getRemainedTimeForPresaleInSecounds() {
        try {;
            let secounds = await this.crowdfundingContract.getRemainedTimeForCurrentPresale();
            return secounds;
        } catch (error) {
            return error.message;
        }
    }
    async getFoundsLeftToRiseForPresale() {
        return ethers.utils.formatUnits(await this.crowdfundingContract.getFundsLeftToRiseForCurrentPresale(), "ether");
    }
    async getAllocationPerPerson(address, presaleNumber) {
        return ethers.utils.formatUnits(await this.crowdfundingContract.getAllocation(address, presaleNumber), "ether");
    }
    async getCurrentPresalePhase() {
        try {
            let currentPhase = await this.crowdfundingContract.getCurrentPhase();
            return currentPhase.toString();
        } catch (error) {
            return error.data.message;
        }
    }
    async getRewardPerPresale(address, presaleNumber) {
        return await this.crowdfundingContract.getRewardPerPresale(address, presaleNumber);
    }
    async getAllowClaimTokens() {
        let timeToWithdraw = await this.crowdfundingContract.getAllowClaimTokens();
        return timeToWithdraw.toString();
    }
    async getTotalOwnedToken(address) {
        let totalTokens = await this.crowdfundingContract.getTotalAirpotToken(address);
        return ethers.utils.formatUnits(totalTokens, "ether");
    }
    async claimFunds() {
        const signer = this.provider.getSigner(0);
        const crowdfundingContract = Crowdfunding(signer, this.crowdfundingAddress);
        try {
            const tx = await crowdfundingContract.claimTokens();
            const receipt = await tx.wait();
            return receipt.transactionHash;
        } catch (error) {
            return error;
        }
    }
    async getRefund(amount) {
        const signer = this.provider.getSigner(0);
        const crowdfundingContract = Crowdfunding(signer, this.crowdfundingAddress);
        let valueInWei = ethers.utils.parseEther(amount.toString());
        try {
            const tx = await crowdfundingContract.getRefund(valueInWei);
            const receipt = await tx.wait();
            return receipt.transactionHash;
        } catch (error) {
            return error.message;
        }
    }
    async contributeToProject(amount) {
        let valueInWei = ethers.utils.parseEther(amount.toString());
        await this.approveUSDT(valueInWei);
        try {
            const signer = this.provider.getSigner(0);
            const crowdfundingContract = Crowdfunding(signer, this.crowdfundingAddress);
            await crowdfundingContract.contribute(valueInWei);
        } catch (error) {
            return error.message;
        }
    }
    async approveUSDT(amount, callback) {
        const signer = this.provider.getSigner(0);
        try {
            const tx = await this.USDTContract.connect(signer).approve(this.crowdfundingAddress, amount);
            const receipt = await tx.wait();
            return receipt.transactionHash;
        } catch (error) {
            return error;
        }
    }
    async approveToken(amount, callback) {
        const signer = this.provider.getSigner(0);
        try {
            const tx = await this.RWDCOntract.connect(signer).approve(this.crowdfundingAddress, amount);
            const receipt = await tx.wait();
            return receipt.transactionHash;
        } catch (error) {
            return error;
        }
    }
}