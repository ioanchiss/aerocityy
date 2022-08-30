import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../../modules/connect-wallet/_services/network.service';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.sass']
})
export class ErrorComponent implements OnInit {
    public errorMessage: any;


    constructor(private networkService: NetworkService) {
        this.errorMessage = this.networkService.NETWORK_NAME;
    }

    ngOnInit(): void {
    }

}
