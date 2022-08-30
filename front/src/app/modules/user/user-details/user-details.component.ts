import { Component, OnInit } from '@angular/core';
import { ConnectWalletService } from '../../connect-wallet/_services/connect-wallet.service';
import { ethers } from "ethers";
declare let window: any;

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.sass']
})
export class UserDetailsComponent implements OnInit {
  public selectedAdress: any;
  public formattedAddress: any;

  constructor(private connectWalletService: ConnectWalletService) { }

  ngOnInit(): void {
    this.connectWalletService.address.subscribe(data => {
      this.selectedAdress = data;
      this.formatString(data)
    });
  }

  public formatString(address: string) {
    const firstChars = address?.slice(0, 5);
    const lastChars = address?.slice(address.length - 4, address.length);
    this.formattedAddress = (firstChars && lastChars) ? firstChars + "..." + lastChars : "";
    return this.formattedAddress;
  }

}
