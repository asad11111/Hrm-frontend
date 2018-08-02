import {Component, Input, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
declare var require:any;
let moment = require('moment');
import {Permission} from '../auth/auth.module';
import {clone} from '../shared/helpers';
import {Alert} from "../shared/components/alert";
import {Confirm} from "../shared/components/confirm";
import {ToastsManager} from "ng2-toastr";


@Component({
    selector: 'shifts',
    templateUrl: './shifts.html',
})
export class Shifts {

    @ViewChild('alert')
    public alert:Alert;

    @ViewChild('confirm')
    public confirm:Confirm;

    public showModal = false;

    public errors:any = {};

    public shift:any;

    public shifts = [];

    public days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    constructor(
        protected http:Http,
        public permission:Permission,
        public toastr:ToastsManager
    ){
        this.resetShift();
    }
    ngOnInit(){
        this.http.get('/attendance/api/v1/shifts').subscribe((res)=>{
            this.shifts = Object.values(res.json().data);
        });
    }
    modalTitle(){
        if(this.shift && this.shift.id){
            return 'Edit Shift';
        }
        return 'New Shift';
    }
    newShift(){
        this.resetShift();
        this.showModal = true;
    }
    resetShift() {
        this.errors = {};
        this.shift = { days: [] };
    }
    edit(shift){
        this.shift = clone(shift);
        this.showModal = true;
        // this.http.get(`/attendance/api/v1/shifts/${shift.id}`).subscribe((res)=>{
        //     this.shift =   res.json().data;
        // });
    }
    save(s){
        s.id ? this.update(s) : this.create(s);
    }
    create(shift){
        this.http.post('/attendance/api/v1/shifts', shift).subscribe((res)=>{
            this.unsetDefaultExcept(shift);
            this.showModal = false;
            this.resetShift();
            this.shifts.unshift(res.json().data);
            this.toastr.success(`Shift '${shift.name}' is successfully created.`);
        }, (res)=>{
            if(res.status !== 422) return;
            this.errors = res.json().errors;
        });
    }
    update(shift){
        this.http.put(`/attendance/api/v1/shifts/${shift.id}`, shift).subscribe((res)=>{
            this.unsetDefaultExcept(shift);
            this.showModal = false;
            this.resetShift();
            let index = this.shifts.findIndex((s)=>{
                return s.id === shift.id
            });
            this.shifts[index] = res.json().data;
            this.toastr.success(`Shift '${shift.name}' is successfully updated.`);
        }, (res)=>{
            if(res.status !== 422) return;
            this.errors = res.json().errors;
        });
    }
    unsetDefaultExcept(shift){
        if(shift.default === false) return;
        this.shifts.forEach((s)=>{
            if(s.id != shift.id){
                s['default'] = false;
            }
        });
    }
    destroy(shift){
        if(shift.default){
            return this.alert.show(`Shift '${shift.name}' is default shift make another shift default before deleting it.`);
        }
        this.confirm.show(`Are you sure you want to delete shift '${shift.name}'?`).then((opt)=>{
            if(opt === false) return;
            this.http.delete(`/attendance/api/v1/shifts/${shift.id}`)
            .subscribe((res)=>{
                this.shifts = this.shifts.filter((s)=>{ return s.id !== shift.id; });
                this.toastr.success(`Shift '${shift.name}' is successfully deleted.`);
            });
        });
    }
}



