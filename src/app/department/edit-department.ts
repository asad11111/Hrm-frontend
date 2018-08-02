import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr";
import {ListDepartment} from "./list-department"

@Component({
    selector   : 'edit-department',
    templateUrl: './edit-department.html',
})
export class EditDepartment {
    
    saving = false;

    constructor(
        protected http:Http,
        protected toastr:ToastsManager,
        protected listDep:ListDepartment
    ){}

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
    public onUpdate = new EventEmitter();

    @Input()
    public departments:any=[];

    public errors = {};

     ngOnInit() {
          
         this.departments=this.listDep.departments;          
    }

    save(){
        this.saving = true;
        var id = this.department.id;
        this.http.put(`/core/api/v1/departments/${id}`, this.department).subscribe((res)=>{
            this.onUpdate.emit(this.department);
            this.toastr.success(`${this.department.name} updated`, 'Department')
            this.saving = false;
        }, (res)=>{
            if(res.status !== 422){
                return this.toastr.error(res.json().message, 'Error')
            }
            this.errors = res.json();
            //console.log(this.errors);
            this.saving = false;
        });
    }

}
