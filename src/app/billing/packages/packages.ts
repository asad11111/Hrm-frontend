import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { Router, ActivatedRoute } from "@angular/router";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Permission } from "../../auth/permission.service";
import { Confirm } from "../../shared/components/confirm";
import { Alert } from "../../shared/components/alert";
import { ToastsManager } from "ng2-toastr";



interface Package {
    id?: number;
    title?: string;
    details?: string;
    amount?: number;
    module_ids?: any;
    employees?: number;
    paymentcycle?: string;
    trial?: boolean;
    trial_duration?: boolean;
    status?: boolean;
}


@Component({
    selector: 'packages',
    templateUrl: './packages.html',
})
export class Packages {

    @ViewChild('package_form') public package_form: ModalDirective;
    @ViewChild('confirmreviewer') confirm: Confirm;
    @ViewChild('alertpoup') alertpoup: Alert;

    public packages: any = [];
    public modules: any = [];
    public package: Package = {};
    public currentPackageID = 0;
    public errors = {};
    public save_package_btn = "fa-save";

    constructor(
        public permission: Permission,
        protected http: Http,
        private activatedRoute: ActivatedRoute,
        protected toastr: ToastsManager
    ) {
        this.package.module_ids = [];
        this.package.paymentcycle = "weekly";
        this.package.status = true;
    }

    ngOnInit() {
        this.loadPackages();
        this.loadModules();
    }

    package_form_show() {
        this.package_form.show();
        this.currentPackageID = 0;
        this.package = {};
        this.package.paymentcycle = 'weekly';
        this.package.status = true;
        this.errors = {};
        this.package.module_ids = [];
    }

    getPackage(d) {

        this.package = d;
        this.package.module_ids = d.modules;
        this.package_form.show();
        this.currentPackageID = d.id;
        this.errors = {};
    }

    loadModules() {

        this.http.get('/core/api/v1/admin/modules').subscribe((res) => {
            this.modules = res.json();
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });

    }


    loadPackages(page_id = 1) {
        var target = '/billing/api/v1/packages';
        this.http.get(target).subscribe((res) => {
            this.packages = res.json();
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });

    }

    alert_errors(errors) {
        for (var i in errors) {
            var e = errors[i];
            var message = e.join(`\n`);
            this.toastr.error(message);
        }
    }

    delPackage(d) {
        var target = `/billing/api/v1/packages/${d.id}`;
        this.confirm.show(`Are you sure want to delete "${d.title}" ?`).then((opt) => {
            if (opt === false) return;

            this.http.delete(target).subscribe((res) => {
                this.toastr.success(`Package ${d.title} deleted successfully.`);
                this.loadPackages();
            }, (res) => {
                if (res.status != 422) return;
                this.errors = res.json().errors;

                res.json().errors.forEach((v,k)=>{
                    this.toastr.error(v);
                });
                console.log(this.errors );
            });
        });
    }

    savePackage() {
        var target = '/billing/api/v1/packages';
        if (this.currentPackageID > 0)
            target = target + '/' + this.currentPackageID;

        this.save_package_btn = "fa-spinner fa-pulse fa-fw";
        this.http.post(target, this.package).subscribe((res) => {
            this.loadPackages();
            this.toastr.success("Package saved successfully.");
            this.save_package_btn = "fa-save";
            this.package_form.hide();
            this.currentPackageID = 0;
        }, (res) => {
            this.save_package_btn = "fa-save";
            if (res.status != 422) return;
            this.errors = res.json().errors;
            //this.alert_errors(this.errors);

        });

    }

    updateModules = (d, i) => {
        var exist = false;
        if (i.target.checked == true) {
            this.package.module_ids.forEach((v, k) => {
                if (v.module_id == d.id)
                    exist = true;
            });
            if (exist == false)
                this.package.module_ids.push({ 'module_id': d.id });
        } else {
            this.package.module_ids.forEach((v, k) => {
                if (v.module_id == d.id)
                    this.package.module_ids.splice(k, 1);
            });
        }
    }

    getModules = (d)=>{

        var modules=this.modules.data;
        var moduleName='';
        d.modules.forEach((v,k)=>{
            modules.forEach((a,n)=>{
                if(a.id==v.module_id)
                    moduleName+= a.name +', ';
            });        
        });
       return moduleName;
    }
    selectedModule = (d) => {
        var pk_modules = this.package.module_ids;
        var exist = false;
        pk_modules.forEach((v, k) => {
            if (d.id == v.module_id)
                exist = true;
        });
        return exist;
    }
}// main class ........