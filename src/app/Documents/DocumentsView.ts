import './DocumentsView.css';
import {Component} from '@angular/core'
import {Http} from "@angular/http";
import {Document} from './Document';
import {ToastsManager} from "ng2-toastr";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import {AuthService} from "../auth/auth.service";

@Component({
    selector   : 'documents-view',
    templateUrl: './DocumentsView.html',
})
export class DocumentsView {

    previewDoc:Document;

    public fileIcons = {
        '1' : 'fa fa-file-text',
        '2': 'fa fa-file-word-o',
        '3': 'fa fa-file-pdf-o'
    };

    public filter:{employee_id:number, q:string};

    doc:Document;

    docs:Array<Document> = [];

    fetching = false;

    fetched = false;

    keyUp = new Subject();



    constructor(
        public http:Http,
        public toastr:ToastsManager,
        auth:AuthService
    ){
        this.filter = {
            q: '',
            employee_id: auth.data.employee.id
        };
    }
    ngOnInit(){
        this.keyUp
        .map((e:any)=> e.target.value)
        .debounceTime(300)
        .distinctUntilChanged()
        .subscribe((value)=>{
            this.filter.q = value;
            this.fetch();
        });
        this.fetch();
    }
    onCreate(doc:Document){
        this.toastr.success('Document successfully created');
        this.docs.push(doc);
        this.doc = null;
    }
    onDelete(doc:Document){
        this.previewDoc = null;
        this.toastr.success('Document successfully deleted');
        this.docs = this.docs.filter((d)=>{
            return d.id !== doc.id;
        });
    }
    fetch(){

        this.fetching = true;
        this.http.get('/core/api/v1/documents', {search: this.filter})
        .subscribe((res)=>{
            this.fetching = false;
            this.fetched = true;
            this.docs = res.json().data;
        },(res)=>{
            this.fetching = false;
        });
    }
    getFileIcon(type){
        return this.fileIcons[type];
    }

}
