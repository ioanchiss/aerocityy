import { Component, OnInit, Output } from '@angular/core';
import { FrontendLibraryService } from '../../_services/frontend-library.service'

@Component({
    selector: 'app-invest',
    templateUrl: './invest.component.html',
    styleUrls: ['./invest.component.sass']
})

export class InvestPage implements OnInit {
    public presalePhase: any;
    public costPerPresale: any;
    public goalPerPresale: any;
    public goalPerPresaleCoins: any;
    public balancePerPresale: any;
    public foundsLeftToRise: any;
    public remainedTimeForPresale: any;

    public days: any;
    public hours: any;
    public minutes: any;
    public investmentProgress: any;


    constructor(public fLibService: FrontendLibraryService) { }


    ngOnInit(): void {
        this.fLibService.presalePhase.subscribe((data) => {
            this.presalePhase = data;
        })

        this.fLibService.costPerPresale.subscribe((data) => {
            this.costPerPresale = data;
        })

        this.fLibService.goalPerPresale.subscribe((data) => {
            this.goalPerPresale = data;
            if (this.costPerPresale && data) {
                this.goalPerPresaleCoins = data / this.costPerPresale;
            }
            this.fLibService.balancePerPresale.subscribe((data) => {
                this.balancePerPresale = data;
                if (this.costPerPresale && data) {
                    this.investmentPercentage();
                }
            })
        })

        this.fLibService.remainedTimeForPresale.subscribe((data) => {
            this.remainedTimeForPresale = data;
            if(data){
                this.secondsToD(this.remainedTimeForPresale);
            }
        })

        this.fLibService.foundsLeftToRise.subscribe((data) => {
            this.foundsLeftToRise = data;
        })
    }

    public secondsToD(seconds: any) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);

        this.days = d > 0 ? d + "d" : "";
        this.hours = h > 0 ? h + "h" : "";
        this.minutes = m > 0 ? m + "m" : "0";
    }

    public investmentPercentage() {
        if (this.balancePerPresale && this.goalPerPresale) {
            this.investmentProgress = (this.balancePerPresale * 100) / this.goalPerPresale;
        }
    }

}
