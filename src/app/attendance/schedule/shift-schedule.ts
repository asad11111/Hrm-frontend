import {Component, Input, ViewChild} from '@angular/core';
import {Http,URLSearchParams} from "@angular/http";
import * as moment from 'moment';
import {ActivatedRoute} from "@angular/router";
import {ToastsManager} from "ng2-toastr";
import {Confirm} from "../../shared/components/confirm";

@Component({
    selector   : 'shift-schedule',
    templateUrl: './shift-schedule.html',
})
export class ShiftSchedule {

    @ViewChild('confirm')
    public confirm:Confirm;

    public shifts = [];

    public employeeShifts = [];

    public employeeShift;

    public employees: any = [];

    public employee_id;

    public fetched = false;

    public fetching = false;

    private defaultShift: any;

    constructor(
        protected http: Http,
        protected route: ActivatedRoute,
        protected toastr:ToastsManager
    ) {}
    ngOnInit() {
        this.fetchShifts();
    }
    fetchShifts(){
        this.http.get('/attendance/api/v1/shifts').subscribe((res)=>{
            this.shifts = res.json().data;
            this.defaultShift = Object.values(this.shifts).find((s)=>{
                return s.default;
            })
        });
    }
    fetch() {
        let id = this.employee_id;
        if(id){
            this.fetching = true;
            this.http.get(`/attendance/api/v1/employees/${id}/shifts`).subscribe((res) =>{
                this.fetching = false;
                this.fetched = true;
                this.employeeShifts = res.json().data
            });
        }
    }
    onAssign(es){
        if(es.employee_id == this.employee_id)
        {
            let index = this.employeeShifts.findIndex((e)=>{
                return es.id === e.id;
            });
            if(index === -1){
                this.employeeShifts.unshift(es);
            }
            else {
                this.employeeShifts[index] = es;
            }
        }
        this.employeeShift = null;
    }
    destroy(es){
        this.confirm.show('Are you sure you want to delete this record ?').then((opt)=>{
            if(opt === false) return;
            this.http.delete(`/attendance/api/v1/employees/${es.employee_id}/shifts/${es.id}`)
            .subscribe((res)=>{
                this.employeeShifts = this.employeeShifts.filter((e)=>{
                    return e.id !== es.id;
                });
            });
        })
    }
    getDefault(){
    }
}
