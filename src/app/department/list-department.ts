import {Component, Input, ViewChild,Output, EventEmitter} from '@angular/core';

import {Http} from "@angular/http";
import {Permission} from "../auth/permission.service";
import {Confirm} from "../shared/components/confirm";
import {Alert} from "../shared/components/alert";
import {clone} from "../shared/helpers";
import {ToastsManager} from "ng2-toastr";
import 'rxjs/add/operator/retry';



@Component({
    selector: 'list-department',
    templateUrl: './list-department.html',
})
export class ListDepartment {

    public failed = false;

    public fetched = false;

    public errors: any;

    public res:any;

    public fetching = false;

    @ViewChild('confirm')
    confirm:Confirm;

    @ViewChild('alert')
    alert:Alert;
 
    editDepartment:any = null;

    addDepartment:any = null;

    public departments:any=[];

    constructor (
        protected http: Http,
        public permission:Permission,
        public toastr: ToastsManager
    ) {
        this.res = {
            data: []
        };
        this.http = http;
        this.errors = {};
    }
    ngOnInit() {
        this.fetchDepartments();
    }
    fetchDepartments(){
        this.fetching = true;
        this.http.get('/core/api/v1/departments/table', {}).subscribe((res) => {
            this.fetched = true;
            this.fetching = false;
            this.res = res.json();
            this.departments=this.res;
        }, (res) => {
            this.failed = true;
            this.fetching = false;
        });
    }
    edit(department){
        if(department.name == 'Executive Group'){
            return this.alert.show(`Executive Group is a default department it can't be edited.`);
        }
        this.editDepartment = clone(department);
    }
    created(department){
         
        this.addDepartment = null;
        this.res.data.unshift(department);
    }
    updated(department){
        this.editDepartment = null;
        var index = this.res.data.findIndex((d)=>{
            return d.id === department.id;
        });
        this.res.data[index] = department;
    }
    destroy(department) {
        if (department.number_of_employees > 0) {
            this.alert.show(`
                You have employees linked to this department. 
                Please shift them to another department before deleting.`
            );
        }
        else {
            this.confirm.show(`Are you sure you want to delete department '${department.name}'`).then((opt)=> {
                if (opt === false) return;
                this.http.delete(`/core/api/v1/departments/${department.id}`).subscribe((res)=>{

                    var index = this.res.data.findIndex((d)=>{
                        return d.id === department.id;
                    });

                    this.res.data.splice(index, 1);
                    this.toastr.success(`${department.name} deleted`, 'Department')

                });
            });
        }
    }
}
