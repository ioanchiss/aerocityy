import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ethers } from "ethers";

@Injectable({
    providedIn: 'root'
})
export class ConnectWalletService {

    public NETWORK_ID = '97';
    public NETWORK_NAME = "Binance Smart Chain Testnet";

    public provider: any;
    public providerSubj = new BehaviorSubject<any>(null);
    public address = new BehaviorSubject("");
    Wallet = {
        selectedAddress: undefined,
    }


    constructor(private router: Router) {
        this.checkNetwork();

        this.registerChainChanged();

        if (this.isAuthenticated()) {
            this.address.next(localStorage.getItem('currentWallet') || "");
        }

        window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
            this.logout();
        });
    }

    public checkNetwork() {
        if (window.ethereum?.networkVersion === this.NETWORK_ID) {
            return true;
        } else {
            console.log(`To User: Please connect Metamask to ${this.NETWORK_NAME}`);
            return false;
        }
    }


    public registerChainChanged() {
        window.ethereum?.on("chainChanged", (chainId: string) => {
            if (ethers.utils.hexValue(parseInt(this.NETWORK_ID)) != chainId) {
                (<HTMLInputElement>document.getElementById("chain-error")).style.display = "block";
            } else {
                (<HTMLInputElement>document.getElementById("chain-error")).style.display = "none";
            }
        });
    }


    public initialStateOfWallet() {
        return {
            selectedAddress: undefined,
        }
    }

    public checkWalletApp() {
        return window.ethereum && window.ethereum.isMetaMask;
    }


    public async connectWallet() {
        if (this.checkWalletApp()) {
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
        } else {
            window.open('https://metamask.io/download.html', '_blank');
            return;
        }
        const [selectedAddress] = await this.provider.send("eth_requestAccounts", [])
        localStorage.setItem('currentWallet', selectedAddress);
        this.address.next(selectedAddress);
        window.location.reload();
        if (this.isAuthenticated()) {
            this.address.next(localStorage.getItem('currentWallet') || "");
        }
    }


    public isAuthenticated() {
        return (window.ethereum?.isConnected()) && (localStorage.getItem("currentWallet") !== null);
    }


    public logout() {
        const wasAuthenticated = this.isAuthenticated()
        this.initialStateOfWallet();
        localStorage.removeItem('currentWallet');
        if (wasAuthenticated) {
            window.location.reload();
        }
    }



}
