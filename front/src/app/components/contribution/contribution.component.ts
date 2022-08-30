import { Component, OnInit } from '@angular/core';
import { Console } from 'console';
import { threadId } from 'worker_threads';
import { FrontendLibraryService } from '../../_services/frontend-library.service'

@Component({
    selector: 'app-contribution',
    templateUrl: './contribution.component.html',
    styleUrls: ['./contribution.component.sass']
})
export class ContributionComponent implements OnInit {
    public costPerPresale: any;
    public presalePhase: any;
    public allocationPerPerson: any;
    // public phases: any = new Array<{}>();
    public phase1 = [1, 0, false];
    public phase2 = [2, 0, false];
    public phase3 = [3, 0, false];
    public phase4 = [4, 0, false];


    constructor(public fLibService: FrontendLibraryService) { }

    ngOnInit(): void {
        this.fLibService.costPerPresale.subscribe((data) => {
            this.costPerPresale = data;
        })
        this.fLibService.presalePhase.subscribe((data) => {
            this.presalePhase = data;
            this.getPhases();
        })
    }

    public async getPhases() {
        var value: any;
        if(this.phase1[0] <= this.presalePhase) {
            value = await this.fLibService.getAllocationPerPerson(1);
            this.phase1 = [1, value];
            this.phase1[2] = true;
        }
        if(this.phase2[0] <= this.presalePhase) {
            value = await this.fLibService.getAllocationPerPerson(2);
            this.phase2 = [2, value];
            this.phase2[2] = true;
        }
        if(this.phase3[0] <= this.presalePhase) {
            value = await this.fLibService.getAllocationPerPerson(3);
            this.phase3 = [3, value];
            this.phase3[2] = true;
        }
        console.log(this.phase3)
        if(this.phase4[0] <= this.presalePhase) {
            value = await this.fLibService.getAllocationPerPerson(4);
            this.phase4 = [4, value];
            this.phase4[2] = true;
        }
        // for (var i = 1; i <= this.presalePhase; i++) {
        //     value = await this.fLibService.getAllocationPerPerson(i);
        //     this.phases.push({
        //         number: i,
        //         value: value,
        //     })
        //     oldPhases = this.phases
        // }
    }

    public refund() {
        var refundValue;
        refundValue = (<HTMLInputElement>document.getElementById("refundValue"))?.value;
        if (refundValue) {
            (<HTMLInputElement>document.getElementById("refundValue")).value = "";
            this.fLibService.getRefund(refundValue)
        }
    }
}
