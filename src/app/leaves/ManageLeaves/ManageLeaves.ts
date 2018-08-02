import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {AuthService} from "../../auth/auth.service";
import {ToastsManager} from "ng2-toastr";
import {ActivatedRoute} from "@angular/router";
import * as moment from 'moment';
import {LeaveHelpers} from "../LeaveHelpers";


@Component({
    selector: 'manage-leaves',
    templateUrl: './ManageLeaves.html',
})
export class ManageLeaves {

    protected res:any;

    public leaves = [];

    public leave;

    public employee:any = {};

    public designation:any = {};

    public department:any = {};

    public fetching = false;

    public fetched = false;

    public stats:any = {
        leavesCount: '?',
        totalLeaves: '?'
    };
    public employee_id: any;

    constructor(
        public http: Http,
        public auth:AuthService,
        public toastr:ToastsManager,
        public route:ActivatedRoute,
        public helpers:LeaveHelpers
    ) {}
    ngOnInit() {
        this.fetchLeaves(this.auth.data.employee.id);
    }
    getDuration(start, end){
    }
    create(employee_id){
        this.leave = {submitted_by: employee_id, status: '1'};
    }
    onCreate(leave){
        this.toastr.success('Leave successfully created');
        this.leaves.push(leave);
        this.leave = null;
    }
    onUpdate(leave){
        this.toastr.success('Leave successfully updated');
        let index = this.leaves.findIndex((l)=> l.id === leave.id);
        this.leaves[index] =  leave;
        this.leave = null;
    }
    edit(leave_id){
        this.http.get(`/attendance/api/v1/leaves/${leave_id}/edit`).subscribe((res)=>{
            this.leave = res.json().data;
        });
    }
    destroy(id){

    }
    fetchLeaves(employee_id){
        this.employee_id = employee_id;
        if(!employee_id) return;
        this.fetching = true;
        this.http.get(
            `/attendance/api/v1/leaves/submitted_by?employee_id=${employee_id}&include[]=employee`
        ).subscribe((res) => {
            let data = res.json().data;
            this.fetching = false;
            this.fetched = true;
            this.leaves = data.leaves;
            this.employee = data.employee;
            this.designation = data.designation;
            this.department = data.department;
        }, (res) => {

        });
    }
}
