import {Component} from '@angular/core';
import {AuthService, Permission} from '../auth/auth.module';
import {Http} from "@angular/http";
import {Router} from "@angular/router";


@Component({
    selector   : 'top-nav',
    templateUrl: './topnav.html',
})
export class TopNav {


    public companies = {};

    public offices = [];

    private office_id: any;

    constructor(
        public auth:AuthService,
        public permission:Permission,
        public http:Http,
        public router:Router
    ){}
    ngOnInit(){
        if(!this.auth.data.user.is_super_admin) return;
        this.office_id = this.auth.data.office.id;
        this.http.get('/core/api/v1/companies').subscribe((res)=>{
            var data = res.json().data;
            this.companies = data.companies;
            this.offices = data.offices;
        });
    }
    logout($event){
        $event.preventDefault();
        this.auth.logout();
    }
    switchOffice(office_id)
    {
        this.http.get(`/core/api/v1/admin/switch_office?office_id=${office_id}`).subscribe((res)=>{
            let data = res.json().data;
            localStorage.setItem('_token', data.token);
            location.reload();
        });
    }
}
