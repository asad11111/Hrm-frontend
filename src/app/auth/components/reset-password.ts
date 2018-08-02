import { Component } from '@angular/core';
import {Http} from "@angular/http";
import {Router, ActivatedRoute} from '@angular/router';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.html'
})
export class ResetPassword{

    public copyrightYear: number;
    public password: string;
    public confirm_password: string;
    public token: string;
    public errors: any;
    public busy: boolean;
    public success:boolean;
    public http:Http;
    public router:Router;
    public activatedRoute: ActivatedRoute;

    constructor(http: Http, router:Router, activatedRoute: ActivatedRoute){
        this.http = http;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.copyrightYear = (new Date()).getFullYear();
        this.success = false;
    }

    ngOnInit(){
        document.body.classList.add('login-page');
        this.activatedRoute.queryParams.filter(params => params.token).subscribe(
            params => {
                this.token = params.token;
            }
        )
    }

    ngOnDestroy(){
        document.body.classList.remove('login-page');
    }
    onKeyPress($event){
        if($event.keyCode != 13) return;
        this.submit();
    }
    submit(){
        this.busy = true;
        let data = {
            password: this.password,
            confirm_password: this.confirm_password,
            token: this.token
        }
        this.http.post('/core/api/v1/password/reset', data).subscribe((res)=>{
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