import { Component, OnInit } from '@angular/core';
import { FrontendLibraryService } from './_services/frontend-library.service'
import { ConnectWalletService } from './modules/connect-wallet/_services/connect-wallet.service'

declare global {
    interface Window {
        ethereum: any;
    }
}
declare var particlesJS: any;


@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.sass"],
})
export class AppComponent {
    title = "client";

    constructor(private fLibraryService: FrontendLibraryService, private connectWallet: ConnectWalletService) {
    }

    ngOnInit(): void {
        const networkCorrect = this.connectWallet.checkNetwork();
        this.connectWallet.registerChainChanged();
        if (!networkCorrect) {
            (<HTMLInputElement>document.getElementById("chain-error")).style.display = "block";
            return;
        }

        particlesJS.load('particles-js', 'assets/scripts/particles.json', null);
        this.fLibraryService.intializeEthers();
    }
}
