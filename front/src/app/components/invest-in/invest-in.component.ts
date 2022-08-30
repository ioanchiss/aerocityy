import { Component, OnInit } from '@angular/core';
import { FrontendLibraryService } from '../../_services/frontend-library.service'

@Component({
    selector: 'app-invest-in',
    templateUrl: './invest-in.component.html',
    styleUrls: ['./invest-in.component.sass']
})
export class InvestComponent implements OnInit {
    public costPerPresale: any
    public presalePhase: any
    public valueCoins: any;
    public valueUSDT: any;
    public investDisabled = false;

    constructor(public fLibService: FrontendLibraryService) { }

    ngOnInit(): void {
        this.fLibService.costPerPresale.subscribe((data) => {
            this.costPerPresale = data;
        })
        this.fLibService.presalePhase.subscribe((data) => {
            this.presalePhase = data;
            if(this.presalePhase == "0") {
                this.investDisabled = true;
            }
        })
    }


    ngOnChanges() {
        if(this.presalePhase == "0") {
            this.investDisabled = true;
        } else {
            this.investDisabled = false;
        }
    }

    public convertCoins() {
        this.valueUSDT = parseInt((<HTMLInputElement>document.getElementById("investValue"))?.value);
        this.valueCoins = (this.valueUSDT / this.costPerPresale);
    }

    public invest() {
        this.fLibService.contributeToProject(this.valueUSDT);
        (<HTMLInputElement>document.getElementById("investValue")).value = "";
        this.convertCoins();
    }

}
