import { Component, OnInit } from '@angular/core';
import { FrontendLibraryService } from '../../_services/frontend-library.service'

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.sass']
})
export class ProjectsPage implements OnInit {
    public presalePhase: any;
    public costPerPresale: any;
    public goalPerPresale: any;
    public goalPerPresaleUSD: any;
    public balancePerPresale: any;
    public balancePerPresaleUSD: any;

    constructor(public fLibService: FrontendLibraryService) { }

    ngOnInit(): void {
        this.fLibService.presalePhase.subscribe((data) => {
            this.presalePhase = data;
        })
        this.fLibService.balancePerPresale.subscribe((data) => {
            this.balancePerPresale = data;
        })
    }

}
