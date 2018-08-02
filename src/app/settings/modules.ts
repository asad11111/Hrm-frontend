import {Component} from '@angular/core';
import {Http} from "@angular/http";
import {AuthService} from "../auth/auth.service";

@Component({
    selector: 'settings-modules',
    templateUrl: './modules.html',
})
export class SettingsModules {

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
        this.http.get(`/core/api/v1/modules`)
            .subscribe((res)=>{
                this.companyModules = res.json().data;
            });
    }
    fetchModules(company_id) {
    }
    installModule(module) {
        module.installing = true;
        this.http.get(`/core/api/v1/modules/${module.id}/install`).subscribe((res)=>{
            this.companyModules.push(res.json().data);
        }, ()=>{

        }, ()=>{
            module.installing = false;
            this.auth.fetchUser();
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
            return installed.module_id == module_id && installed.status;
        });
    }
}

