import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {ActivatedRoute} from "@angular/router";
import  {EmployeeShiftsStore, actions} from './store';

@Component({
    selector   : 'employee-list-shifts',
    templateUrl: './list-shifts.html',
})
export class EmployeeListShifts {

    @Input()
    public state:any = {};

    constructor(
        protected route:ActivatedRoute,
        protected store:EmployeeShiftsStore
    ) {}
    ngOnInit(){
        this.route.params.subscribe((params)=>{
            this.store.emit(actions.FETCH_EMPLOYEE_SHIFTS, params['id']);
        });
    }
    newShift(){
        this.store.emit(actions.NEW_SHIFT);
    }
    editShift(shift){
        this.store.emit(actions.EDIT_SHIFT, shift);
    }
}
