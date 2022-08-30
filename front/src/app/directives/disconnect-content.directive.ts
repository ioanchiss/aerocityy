import { Directive, ElementRef } from '@angular/core';
import { ConnectWalletService } from '../modules/connect-wallet/_services/connect-wallet.service';

@Directive({
  selector: '[appDisconnectContent]'
})
export class DisconnectContentDirective {

  constructor(private connectWalletService: ConnectWalletService, private element: ElementRef) {
    if(this.connectWalletService.isAuthenticated()) {
      this.element.nativeElement.style.display = "block"
    } else {
      this.element.nativeElement.style.display = "none"
    }
  }
}
