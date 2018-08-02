import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {toFormData, uriToBlob} from "../../shared/helpers";
import {ToastsManager} from "ng2-toastr";

@Component({
    selector   : 'salaries-import-modal',
    templateUrl: './SalariesImportModal.html',
})
export class SalariesImportModal {

    @Input()
    public show = false;

    public file;

    public errors;

    @Output()
    public onHide = new EventEmitter();

    @Output()
    public onDone = new EventEmitter();

    public uploading: boolean;

    constructor(public http:Http, public toastr:ToastsManager){

    }

    public upload(){
        this.uploading = true;
        let data = toFormData({file: this.file || ''});
        this.http.post('/payroll/api/v1/employee_salaries/csv', data)
        .subscribe((res)=>{
            this.toastr.success('Salaries successfully updated');
            this.uploading = false;
            this.onDone.emit();
        }, (res)=>{
            this.uploading = false;
            this.errors = res.json().errors;
        });
    }
}
