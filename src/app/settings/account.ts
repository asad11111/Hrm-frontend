import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {clone} from '../shared/helpers';
import {ToastsManager} from "ng2-toastr";

@Component({
    selector: 'settings-account',
    templateUrl: './account.html',
})
export class SettingsAccount {

    passwords:any = {};

    errors:any = {};

    saving = false;

    imgSrc;

    constructor(protected http:Http, protected toastr:ToastsManager){

    }
    ngOnInit(){

    }
    change(){
        this.saving = true;
        this.http.put('/core/api/v1/change_password', this.passwords)
        .subscribe((res)=>{
            this.saving = false;
            this.passwords = {};
            this.errors = {};
            this.toastr.success('You password has been successfully updated');
        },(res)=>{
            this.saving = false;
            if(res.status !== 422) return;
            this.errors = res.json().errors;
        });
    }
}