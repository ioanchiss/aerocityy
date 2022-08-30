import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot, UrlTree } from '@angular/router';

import { ConnectWalletService } from '../modules/connect-wallet/_services/connect-wallet.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private connectWalletService: ConnectWalletService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {

    if (!this.connectWalletService.isAuthenticated()) {
      this.router.navigate(["login"]);
      return false;
    }
    return true;
  }

}
