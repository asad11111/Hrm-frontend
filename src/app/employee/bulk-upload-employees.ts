import {Component, Input, ViewChild} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {AuthService} from "../auth/auth.service";
import {Router} from '@angular/router';
import {ToastsManager} from "ng2-toastr";

@Component({
    selector   : 'bulk-upload-employees',
    templateUrl: './bulk-upload-employees.html',
})
export class BulkUploadEmployees {

    @ViewChild('inputFile')
    public inputFile;

    public retry = false;

    public errors = {};

    public employees = [];

    public saving = false;

    constructor(
        protected http:Http,
        public toastr:ToastsManager,
    ){}
    uploadFile(){
        var file = this.inputFile.nativeElement.files[0];
        if(!file) return;
        var data = new FormData();
        data.append('employees', file);
        this.http.post('/core/api/v1/employees/bulk', data).subscribe((res)=>{
            this.employees = res.json().data;
            this.toastr.success(`The employees were successfully added`);
        }, (res)=>{
            this.retry = true;
            if(res.status !== 422) return;
            this.errors = res.json().errors;
        });
    }
}
