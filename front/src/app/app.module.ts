import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { TranslateModule} from '@ngx-translate/core';
import { HttpClientModule} from '@angular/common/http';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from './modules/icons/icons.module';

//Pages
import { appRoutes } from './app.routes';
import { ProjectsPage } from './pages/projects/projects.component';
import { AboutPage } from './pages/about/about.component';
import { InvestPage } from './pages/invest/invest.component';

//Modules
import { ConnectWalletComponent } from './modules/connect-wallet/connect-wallet/connect-wallet.component';
import { DisconnectWalletComponent } from './modules/connect-wallet/disconnect-wallet/disconnect-wallet.component';
import { UserDetailsComponent } from './modules/user/user-details/user-details.component';

//Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { ConnectContentDirective } from './directives/connect-content.directive';
import { DisconnectContentDirective } from './directives/disconnect-content.directive';
import { InvestComponent } from './components/invest-in/invest-in.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ClaimRewardsComponent } from './components/claim-rewards/claim-rewards.component';
import { ContributionComponent } from './components/contribution/contribution.component';
import { ErrorsComponent } from './modules/errors/errors.component';
import { ErrorComponent } from './components/error/error.component';


@NgModule({
  declarations: [
    AppComponent,
    ConnectWalletComponent,
    DisconnectWalletComponent,
    UserDetailsComponent,
    
    AboutPage,
    InvestPage,

    NavbarComponent,
     ConnectContentDirective,
     DisconnectContentDirective,
     InvestComponent,
     ProjectsPage,
     LoaderComponent,
     ClaimRewardsComponent,
     ContributionComponent,
     ErrorsComponent,
     ErrorComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NgbModule,
    IconsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
