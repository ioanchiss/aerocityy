import { Injectable } from '@angular/core';
import { ethers } from "ethers";


@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    public NETWORK_ID = '97';
    public NETWORK_NAME = "Binance Smart Chain Testnet";

    constructor() { }

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
                // this.connectWalletService.logout();
                (<HTMLInputElement>document.getElementById("chain-error")).style.display = "none";
            }
        });
    }
}

