import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr";
import {Document} from './Document';
import {toFormData} from "../shared/helpers";
import {Confirm} from "../shared/components/confirm";

@Component({
    selector   : 'document-preview-modal',
    templateUrl: './DocumentPreviewModal.html',
})
export class DocumentPreviewModal {

    @ViewChild('confirm')
    confirm:Confirm;

    @Output()
    public onDelete = new EventEmitter();

    _doc:Document;

    @Input()
    public set doc(val){
        this._doc = val;
    }
    public get doc(){
        return this._doc
    }
    @Output()
    public onHide = new EventEmitter();

    public errors = {};

    public uploading = false;

    constructor(
        protected http:Http,
        protected toastr:ToastsManager,
    ){
    }
    public destroy(doc)
    {
        this.confirm.show('Are you sure you want to delete this document?')
        .then((opt)=>{
            if(opt === false) return;
            this.http.delete(`/core/api/v1/documents/${doc.id}`)
            .subscribe((res)=>{
                this.onDelete.emit(doc);
            });
        });
    }


}
