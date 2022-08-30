import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorsService {
    public errorMessage = new BehaviorSubject<any>(null);

    constructor() { }

    public showError(errorMessage: any) {
        this.errorMessage.next(errorMessage);        
    }
}
