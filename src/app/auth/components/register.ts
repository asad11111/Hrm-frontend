import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
    selector   : 'register',
    templateUrl: './register.html',
})
export class Register {

    public busy:boolean = false;
    public data:any = {};
    public errors:any;
    public token:string;
    public affiliation:any;
    public affiliate:any;
    public copyrightYear: number;
    constructor(public http: Http,
                public router:Router,
                public auth:AuthService,
                public route: ActivatedRoute
    ){
        this.errors = {};
        let d = new Date();
        this.data.offset = 12*60; // offset (minutes) for timezone Pacific/Auckland ( default time zone)
        this.copyrightYear = d.getFullYear();
    }
    ngOnInit() {
        document.body.classList.add('login-page');
        this.route.queryParams.subscribe((params:any)=>{
            this.affiliation = null;
            this.affiliate = null;
            if(params.token){
                this.busy = true;
                this.http.get(`/affiliates/api/v1/affiliations/${params.token}/get_for_sign_up`)
                .subscribe((res)=>{
                    let data = res.json();
                    this.affiliation = data.affiliation;
                    this.data.email = data.affiliation.company_email;
                    this.data.name = data.affiliation.company_name;
                    this.affiliate = data.affiliate;
                    this.busy = false;
                }, (res)=>{
                    this.busy = false;
                })
            }
        });
    }
    ngOnDestroy(){
        document.body.classList.remove('login-page');
    }
    register(){
        this.busy = true;
        if(this.affiliation){
            this.data.affiliation_id = this.affiliation.id;
        }
        this.http.post('/core/api/v1/register', this.data).subscribe((res)=>{
            this.busy = false;
            // var data = res.json().data.user;
            // var token = res.json().data.token;
            // this.auth.login(data, token);
            this.router.navigate(['/login']);
        }, (res)=>{
            this.busy = false;
            if(res.status != 422) return;
            this.errors = res.json();
        });
    }
    login(){
      
    }

}
