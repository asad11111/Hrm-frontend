import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from '@angular/router';
import {EmployeeShiftsStore, actions} from './store';

@Component({
    selector   : 'assign-shift-modal',
    templateUrl: './assign-shift-modal.html',
})
export class AssignShiftModal {

    @Input()
    public shift:any = {};

    @Input()
    public shifts = [];

    @Input()
    public errors = {};

    @Input()
    public employeeId;

    constructor(
        protected store:EmployeeShiftsStore
    ){}
    ngOnInit(){
        this.store.emit(actions.FETCH_SHIFTS);
    }
    cancel(){
        this.store.emit(actions.CANCEL_NEW_SHIFT);
    }
    save(){
        if(this.shift.id){
            this.store.emit(actions.UPDATE_SHIFT, this.shift, this.employeeId);
            return;
        }
        this.store.emit(actions.SAVE_SHIFT, this.employeeId);
    }
    getTitle(){
        if(this.shift && this.shift.id){
            return 'Edit '+ this.shift.shift.name;
        }
        return 'New Shift';
    }
}
