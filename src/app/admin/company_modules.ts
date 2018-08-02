import {Component} from '@angular/core';
import {Http} from "@angular/http";
import {AuthService} from "../auth/auth.service";

@Component({
    selector: 'company-modules',
    templateUrl: './company_modules.html',
})
export class CompanyModules {

    public companies = [];

    public company_id;

    public modules = [] ;

    public companyModules = [];

    public installing = false;

    public uninstalling = false;

    constructor(
        protected http:Http,
        protected auth:AuthService
    ){}
    ngOnInit() {
        this.http.get('/core/api/v1/admin/modules').subscribe((res)=>{
            this.modules = res.json().data;
        });
        this.http.get('/core/api/v1/admin/companies').subscribe((res)=>{
            this.companies = res.json().data;
            this.company_id = this.companies[0].id;
            this.fetchModules(this.company_id);
        });
    }
    fetchModules(company_id) {
        this.http.get(`/core/api/v1/admin/companies/${company_id}/modules`)
        .subscribe((res)=>{
            this.companyModules = res.json().data;
        });
    }
    installModule(module) {
        module.installing = true;
        this.http.get(`/core/api/v1/admin/modules/${module.id}/install?company_id=${this.company_id}`).subscribe((res)=>{
            this.companyModules.push(res.json().data);
        }, ()=>{

        }, ()=>{
            module.installing = false;
            if(this.auth.data.company.id == this.company_id){
                this.auth.fetchUser();
            }
        });
    }
    uninstallModule(module_id){

        // this.uninstalling = true;
        //
        // this.http.get(`/api/v1/admin/modules/${module_id}/uninstall?company_id=`).subscribe(()=>{
        //
        // },()=>{
        //
        // },()=>{
        //     this.uninstalling = false;
        // });
    }
    isInstalled(module_id){
        return this.companyModules.some((installed)=>{
            return installed.module_id == module_id;
        });
    }
    isActive(module_id){
        return this.companyModules.some((installed)=>{
            return installed.module_id == module_id && installed.status === true;
        });
    }
}

