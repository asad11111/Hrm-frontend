import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {Router, NavigationEnd, NavigationStart} from "@angular/router";

declare let window:any;

@Component({
    selector: 'shell',
    templateUrl: './shell.html'
})
export class Shell {

    public loading = false;

    constructor(protected router:Router){}

    ngOnInit(){
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.loading = true;
            }
            else if (event instanceof NavigationEnd) {
                this.loading = false;
            }
        });
    }
    ngAfterViewInit(){
        window.__initTheme();
    }
}
