import { Component, OnInit } from '@angular/core';
import { FrontendLibraryService } from '../../_services/frontend-library.service'

@Component({
  selector: 'app-claim-rewards',
  templateUrl: './claim-rewards.component.html',
  styleUrls: ['./claim-rewards.component.sass']
})
export class ClaimRewardsComponent implements OnInit {
    public totalOwnedToken: any;
    public presalePhase: any;
    public allowClaimTokens: any;
    public claimDisabled = true;

    constructor(public fLibService: FrontendLibraryService) { }

    ngOnInit(): void {
        this.fLibService.totalOwnedToken.subscribe((data) => {
            this.totalOwnedToken = data;
        })
        this.fLibService.presalePhase.subscribe((data) => {
            this.presalePhase = data;
            if(this.presalePhase == "0") {
                this.claimDisabled = false;
            }
        })
        this.fLibService.allowClaimTokens.subscribe((data) => {
            this.allowClaimTokens = data;
        })

    }

    ngOnChanges() {
        if(this.presalePhase == "0") {
            this.claimDisabled = false;
        } else {
            this.claimDisabled = true;
        }
    }

    public claimFunds() {
        this.fLibService.claimFunds();
    }
}
