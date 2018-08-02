import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr";
import {ListDepartment} from "./list-department"

@Component({
    selector   : 'add-department',
    templateUrl: './add-department.html',
})
export class AddDepartment {

    adding = false;

    constructor(
        protected http:Http,
        protected toastr:ToastsManager,
        protected listDep:ListDepartment,
    ){    }

    protected _department:any;

    @Input()
    public set department(val){
        this._department = val;
        this.errors = {};
    }
    public get department(){
        return this._department;
    }

    @Output()
    public onCancel = new EventEmitter();

    @Output()
    public onCreate = new EventEmitter();

     @Input()
     public departments:any=[];
    

    public errors = {};

     ngOnInit() {
          
         this.departments=this.listDep.departments;          
    }
 
    create(){
        this.adding = true;
        this.http.post(`/core/api/v1/departments`, this.department).subscribe((res)=>{
            this.adding = false;
            this.onCreate.emit(res.json().data);
            this.toastr.success(`${this.department.name} added`, 'Department');
        }, (res)=>{
            if(res.status !== 422){
                this.toastr.success(res.json().message, 'Error');
                return;
            }
            this.errors = res.json();
            //console.log(this.errors);
            this.adding = false;
        });
    }

}

