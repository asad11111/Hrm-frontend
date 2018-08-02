import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {clone, toFormData} from '../shared/helpers';
import {AuthService} from "../auth/auth.service";
import {ToastsManager} from "ng2-toastr";
let logoSrc = require('../../assets/logo/128x128.png');

@Component({
    selector: 'settings-general',
    templateUrl: './general.html',
})
export class SettingsGeneral {

    public logoSrc:string;

    public company:any = {
        address: {}
    };

    public office:any = {};

    public timezones = [];

    public errors = {
        company: {},
        office: {}
    };
    updatingCompany = false;

    updatingOffice = false;

    constructor(
        protected http:Http,
        public auth:AuthService,
        public toastr:ToastsManager
    ){}
    ngOnInit(){
        this.http.get('/core/api/v1/company/details').subscribe((res)=>{
            let data = res.json().data;
            this.company = data.company;
            this.office = data.office;
        });
        this.http.get('/core/api/v1/tz/list').subscribe((res)=>{
            this.timezones = res.json().data;
        });
    }
    updateCompany(){
        this.updatingCompany = true;
        let data = clone(this.company);
        data.offices = null;
        this.http.post('/core/api/v1/company/details', this.company).subscribe((res)=>{
            this.updatingCompany = false;
        }, (res)=>{
            if(res.status !== 422) return;
            this.errors.company = res.json().errors;
        });
    }
    updateOffice(office){
        this.updatingOffice = true;
        this.http.post(`/core/api/v1/offices/${office.id}`, office).subscribe((res)=>{
            this.updatingOffice = false;
        }, (res)=>{
            if(res.status !== 422) return;
            this.errors.office[office.id] = res.json().errors;
        });
    }
    onLogoChange(file:File){
        this.logoSrc = URL.createObjectURL(file);
    }
    saveLogo(blob){
        let data = toFormData({logo: blob});
        this.http.post('/core/api/v1/offices/logo', data)
        .subscribe((res)=>{
            let logo_id = res.json().data.id;
            this.office.logo_id = logo_id;
            this.auth.data.office.logo_id = logo_id;
            this.logoSrc = null;
            this.toastr.success('Logo successfully updated');
        });
    }
    getLogoUrl(){
        if(this.office.logo_id){
            return `/core/api/v1/images/${this.office.logo_id}`;
        }
        return logoSrc;
    }
}