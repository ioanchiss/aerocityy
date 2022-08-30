import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ethers } from "ethers";
import { ConnectWalletService } from "../modules/connect-wallet/_services/connect-wallet.service"
import { FrontendLibrary } from '../../../../src/front-library';


@Injectable({
    providedIn: 'root'
})
export class FrontendLibraryService {
    private _frontendLib: any;
    public provider: any;
    private address: any;
    public CROWDFUNDINGADDRESS = "0x692DbFEf0Db316F31191CB8439fF076C07103A00";
    public USDT_ADDRESS = "0x5e32cEA0BFb743C6bf0DeeB0A68CF75042Ef48bb";
    public ARIPORT_ADDRESS = "0xBa9FEa35552c6C1b2EAFAb0597215b17BEa3a39C";

    public presalePhase = new BehaviorSubject<any>(null);
    public goalPerPresale = new BehaviorSubject<any>(null);
    public costPerPresale = new BehaviorSubject<any>(null);
    public balancePerPresale = new BehaviorSubject<any>(null);
    public numberOfDays = new BehaviorSubject<any>(null);
    public foundsLeftToRise = new BehaviorSubject<any>(null);
    public remainedTimeForPresale = new BehaviorSubject<any>(null);
    public allocationPerPerson = new BehaviorSubject<any>(null);
    public totalOwnedToken = new BehaviorSubject<any>(null);
    public allowClaimTokens = new BehaviorSubject<any>(null);

    
    async intializeEthers() {
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.address = localStorage.getItem('currentWallet') || "";
        this._frontendLib = new FrontendLibrary(this.provider, this.CROWDFUNDINGADDRESS, this.USDT_ADDRESS, this.ARIPORT_ADDRESS);
        setInterval(() => {
            this.refresh()
        }, 2000);
    }

    public refresh() {
        this.getCurrentPresalePhase();
        this.getCurrentPresaleCost();
        this.getCurrentPresaleGoal();
        this.getCurrentPresaleBalance();
        this.getFoundsLeftToRiseForPresale();
        this.getRemainedTimeForPresaleInSecounds();
        if(this.address){
            this.getTotalOwnedToken();
        }
    }
    

    async getCurrentPresalePhase() {
        this.presalePhase.next(await this._frontendLib.getCurrentPresalePhase());
    }
    
    async getCurrentPresaleCost() {
        this.costPerPresale.next(await this._frontendLib.getCurrentPresaleCost());
    }

    async getCurrentPresaleGoal() {
        this.goalPerPresale.next(await this._frontendLib.getCurrentPresaleGoal());
    }

    async getCurrentPresaleBalance() {
        this.balancePerPresale.next(await this._frontendLib.getCurrentPresaleBalance());
    }

    async getFoundsLeftToRiseForPresale() {
        this.foundsLeftToRise.next(await this._frontendLib.getFoundsLeftToRiseForPresale());
    }

    async getRemainedTimeForPresaleInSecounds() {
        this.remainedTimeForPresale.next(await this._frontendLib.getRemainedTimeForPresaleInSecounds());
    }

    async getTotalOwnedToken() {
        this.totalOwnedToken.next(await this._frontendLib.getTotalOwnedToken(this.address));
    }

    async getAllowClaimTokens() {
        this.allowClaimTokens.next(await this._frontendLib.getAllowClaimTokens());
    }

    public getAllocationPerPerson(presaleNumber: any) {
       return this._frontendLib.getAllocationPerPerson(this.address, presaleNumber);
    }
    
    async contributeToProject(amount: any) {
        await this._frontendLib.contributeToProject(amount);
    }

    async claimFunds() {
        await this._frontendLib.claimFunds();
    }

    async getRefund(ammount: any) {
        await this._frontendLib.getRefund(ammount);
    }
}

