import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {Http} from "@angular/http";
import {AuthService} from "../auth/auth.service";
import * as  moment from 'moment';
import * as qs from 'qs';

@Component({
    selector: 'leave',
    templateUrl: 'leave.html'
})
export class Leave {

    public labelClasses = {
        0: 'label-warning',
        1: 'label-success',
        2: 'label-danger'
    };
    public textClasses = {
        0: 'text-warning',
        1: 'text-success',
        2: 'text-danger'
    };

    public status:any = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected'
    };

    @Input()
    public show = false;

    @Input()
    public leave:any = {};

    @Input()
    public employees = {};

    @Input()
    public designations = {};

    @Input()
    public departments = {};

    @Input()
    public requests = [];

    @Output()
    public onUpdate = new EventEmitter();

    public leavesCount = {};

    @Output()
    onHide = new EventEmitter();

    constructor(public http:Http, public auth:AuthService){
       
    }
    getLabelClass(status){
        return this.labelClasses[status];
    }
    getDuration(){
        return moment(this.leave.end_date).diff(moment(this.leave.start_date), 'days');
    }
    submit(status, request){
        let data = {
            id: request.id,
            status: status,
            remarks: request.remarks
        };
 
        this.http.post(`/attendance/api/v1/leaves/${request.id}/submit`, data).subscribe((res)=>{
            this.onUpdate.emit(res.json().data);
            request.status = status;
        });
    }
    isSubmittedToCurrentUser(){
        return this.requests.some((r)=>{
            return r.employee_id == this.auth.data.employee.id;
        });
    }
    isActionable(){
        return this.requests.filter((r)=>{
            return r.employee_id == this.auth.data.employee.id;
        }).every((r)=>{
            return r.status === '0';
        })
        ;
    }
    getStatusImage(leave)
    {
        if(leave.status == 0) return;
        let status = leave.status == '1' ? 'approved' : 'rejected';
        return '/images/leave_' + status + '.png';
    }
}