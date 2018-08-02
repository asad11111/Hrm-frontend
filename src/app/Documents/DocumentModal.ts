import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr";
import {Document} from './Document';
import {toFormData} from "../shared/helpers";
import {Confirm} from "../shared/components/confirm";

@Component({
    selector   : 'document-modal',
    templateUrl: './DocumentModal.html',
})
export class DocumentModal {

    _doc:Document;


    @Input()
    public set doc(val){
        this.errors = {};
        this._doc = val;
    }
    public get doc(){
        return this._doc
    }
    @Output()
    public onCancel = new EventEmitter();

    @Output()
    public onCreate = new EventEmitter();


    public errors = {};

    public uploading = false;

    constructor(
        protected http:Http,
        protected toastr:ToastsManager,
    ){
    }
    public create(){
        this.uploading = true;
        this.http.post('/core/api/v1/_documents', toFormData(this.doc))
        .subscribe((res)=>{
            this.errors = {};
            this.uploading = false;
            this.onCreate.emit(res.json().data);
        }, (res)=>{
            this.uploading = false;
            if(res.status !== 422) return;
            this.errors = res.json().errors;
        });
    }


}
