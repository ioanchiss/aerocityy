import { Component, OnInit } from '@angular/core';
import { ConnectWalletService } from '../_services/connect-wallet.service';
import { NetworkService } from '../_services/network.service';


@Component({
  selector: 'app-connect-wallet',
  templateUrl: './connect-wallet.component.html',
  styleUrls: ['./connect-wallet.component.sass']
})
export class ConnectWalletComponent implements OnInit {
  public selectedAdress: any;
  public userConnected: any;

  constructor(private connectWalletService: ConnectWalletService, private networkService: NetworkService) { }

  ngOnInit(): void {
    const networkCorrect = this.networkService.checkNetwork();
    this.connectWalletService.address.subscribe(data => {
      this.selectedAdress = data
    });

    if (this.connectWalletService.isAuthenticated() && networkCorrect) {
      this.userConnected = true;
      this.selectedAdress = localStorage.getItem("currentWallet");
    }

  }

  connectWallet() {
    this.connectWalletService.connectWallet();
  }

}
