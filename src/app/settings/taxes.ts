import {Component, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {AuthService} from "../auth/auth.service";
import {Confirm} from "../shared/components/confirm";

@Component({
    selector: 'settings-taxes',
    templateUrl: './taxes.html',
})
export class SettingsTaxes {

    public errors = {};
    public taxes = [];
    public title = '';
    public value:any = 0;
    public tax_id = 0;
    public _show_modal = false;

    @ViewChild('confirm')
    public confirm:Confirm;

    constructor(
        protected http:Http,
        protected auth:AuthService
    ){}
    ngOnInit() {
        this.http.get('/payroll/api/v1/taxes').subscribe((res)=>{
            this.taxes = res.json().data;
        });
    }

    initialize_defaults(){
        this.errors = {};
        this.title = '';
        this.value = 0;
        this.tax_id = 0;
        this._show_modal = false;
    }

    create(){
        this.http.post('/payroll/api/v1/taxes',{
            title: this.title,
            value: this.value
        }).subscribe((res)=>{
            this.taxes.push(res.json().data);
            this.initialize_defaults();
        }, (res)=>{
            if(res.status !== 422) return;
            this.errors = res.json().errors;
        });
    }

    edit(tax){
        this.errors = {};
        this.title = tax.title;
        this.value = tax.value;
        this.tax_id = tax.id;
    }
    update(){
        this.http.put(`/payroll/api/v1/taxes/${this.tax_id}`, {
            title: this.title,
            value: this.value
        }).subscribe((res)=>{
            let index = this.taxes.findIndex((l) => l.id === this.tax_id);
            this.taxes[index] = res.json().data;
            this.initialize_defaults();
        }, (res)=>{
            if(res.status !== 422) return;
            this.errors = res.json().errors;
        });
    }

    destroy(tax){
        this.confirm.show('Are you want to delete "'+tax.title+'"?').then((opt)=>{
            if(opt === false) return;
                this.http.delete(`/payroll/api/v1/taxes/${tax.id}`).subscribe((res)=>{
                var index = this.taxes.indexOf(tax);
                this.taxes.splice(index, 1);
            });
        });
    }
}

