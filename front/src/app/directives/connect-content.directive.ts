import { Directive, ElementRef } from '@angular/core';
import { ConnectWalletService } from '../modules/connect-wallet/_services/connect-wallet.service';

@Directive({
  selector: '[appConnectContent]'
})
export class ConnectContentDirective {

  constructor(private connectWalletService: ConnectWalletService, private element: ElementRef) {
    if(this.connectWalletService.isAuthenticated()) {
      this.element.nativeElement.style.display = "none"
    } else {
      this.element.nativeElement.style.display = "block"
    }
  }

}
