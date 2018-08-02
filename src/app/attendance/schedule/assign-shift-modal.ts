import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Http} from "@angular/http";
import {clone} from "../../shared/helpers";
import * as moment from 'moment';
import {dateTimeFormat} from "../../shared/constants";
import {AuthService} from "../../auth/auth.service";

@Component({
    selector   : 'assign-shift-modal',
    templateUrl: './assign-shift-modal.html',
})
export class AssignShiftModal {

    @Input()
    public employees = [];

    public employee_id;

    public _shift;

    public _shifts = [];

    @Input()
    public set shifts(val){
        this._shifts = Object.values(val);
    }
    public get shifts(){
        return this._shifts;
    }
    @Input()
    public set shift(val){
        this.errors = {};
        this._shift = val;
    }
    public get shift(){
        return this._shift;
    }

    @Output()
    public onHide = new EventEmitter();

    @Output()
    public onAssign = new EventEmitter();

    public errors:any = {};

    constructor(protected http: Http, auth:AuthService){

    }
    save(){
        this.shift.id ? this.update() : this.create();
    }
    create(){
        let employeeId = this.shift.employee_id;
        this.http.post(`/attendance/api/v1/employees/${employeeId}/shifts`, this.shift)
        .subscribe((res)=>{
            this.onAssign.emit(res.json().data);
        }, (res)=>{
            this.errors = res.json().errors;
        })
    }
    update(){
        let employeeId = this.shift.employee_id;
        this.http.put(`/attendance/api/v1/employees/${employeeId}/shifts/${this.shift.id}`, this.shift)
        .subscribe((res)=>{
            this.onAssign.emit(res.json().data);
        }, (res)=>{
            this.errors = res.json().errors;
        })
    }
}
