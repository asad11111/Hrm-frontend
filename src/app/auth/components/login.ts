import './login.css';
import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
// import { Date } from 'core-js/library/web/timers';

interface Credentials {
    email?:string;
    password?:string;
}

@Component({
    selector   : 'login',
    templateUrl: './login.html',
})
export class Login {

    public credentials:Credentials;
    public http:Http;
    public router:Router;
    public auth:AuthService;
    public busy = false;
    public errors:any;
    public copyrightYear: number;

    constructor(http: Http, router:Router, auth:AuthService){
        this.credentials = {};
        this.http = http;
        this.errors = {};
        this.router = router;
        this.auth = auth;
        this.copyrightYear = (new Date()).getFullYear();
    }
    ngOnInit() {
        document.body.classList.add('login-page');
    }
    ngOnDestroy(){
        document.body.classList.remove('login-page');
    }
    onKeyPress($event){
        if($event.keyCode != 13) return;
        this.login();
    }
    login(){
        this.busy = true;
        this.http.post('/core/api/v1/login', this.credentials).subscribe((res)=>{
            this.auth.login(res.json().data);
            this.busy = false;
        }, (res)=>{
            this.busy = false;
            if(res.status != 422) return;
            this.errors = res.json().errors;
        });
    }
}