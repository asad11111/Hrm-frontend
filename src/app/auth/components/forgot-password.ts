import { Component } from '@angular/core';
import {Http} from "@angular/http";
import {Router} from '@angular/router';

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.html'
})
export class ForgotPassword{

    public copyrightYear: number;
    public email: string;
    public client_path: string;
    public errors: any;
    public busy: boolean;
    public success: boolean;
    public http:Http;
    public router:Router;

    constructor(http: Http, router:Router){
        this.http = http;
        this.router = router;
        this.busy = false;
        this.success = false;
        this.copyrightYear = (new Date()).getFullYear();
        this.client_path = "/password/reset";
    }

    ngOnInit(){
        document.body.classList.add('login-page');
    }

    ngOnDestory(){
        document.body.classList.remove('login-page');
    }

    submit(){
        this.busy = true;
        this.http.post('/core/api/v1/password/forgot', {email: this.email, client_path: this.client_path}).subscribe((res)=>{
            this.busy = false;
            this.success = true;
            this.errors = [];
        }, (res)=>{
            this.busy = false;
            this.success = false;
            if(res.status != 422) return;
            this.errors = res.json().errors;
        });
    }
}