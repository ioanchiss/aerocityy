import { Component, OnInit } from '@angular/core';
import { ConnectWalletService } from '../_services/connect-wallet.service';

@Component({
  selector: 'app-disconnect-wallet',
  templateUrl: './disconnect-wallet.component.html',
  styleUrls: ['./disconnect-wallet.component.sass']
})
export class DisconnectWalletComponent implements OnInit {
  public selectedAdress: any;

  constructor(private connectWalletService: ConnectWalletService) { }

  ngOnInit(): void {
    this.connectWalletService.address.subscribe(data => {
      this.selectedAdress = data;
    });
  }

  public logOut() {
    this.connectWalletService.logout()
  }

}
