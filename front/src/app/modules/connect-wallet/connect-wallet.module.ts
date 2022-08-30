import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectWalletComponent } from './connect-wallet/connect-wallet.component';
import { DisconnectWalletComponent } from './disconnect-wallet/disconnect-wallet.component';



@NgModule({
  declarations: [
    ConnectWalletComponent,
    DisconnectWalletComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ConnectWalletModule { }
