import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.sass']
})
export class LoaderComponent implements OnInit {
    @Input() time = null;
    public loading: any;


    constructor() { }

    ngOnInit(): void {
        const loader = document.querySelector('.loader') as HTMLElement | null;
    }

    ngOnChanges() {
        if (this.time != null) {
            this.loading = false;
        } else {
            this.loading = true;
        }
    }

}
