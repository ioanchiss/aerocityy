import { Component, OnInit } from '@angular/core';
import { ErrorsService } from './_services/errors.service';

@Component({
    selector: 'app-errors',
    templateUrl: './errors.component.html',
    styleUrls: ['./errors.component.sass']
})
export class ErrorsComponent implements OnInit {
    public errorMessage: any;

    constructor(private errorsService: ErrorsService) { }

    ngOnInit(): void {
        this.errorsService.errorMessage.subscribe(data => {
            this.errorMessage = data
        });
    }

}
