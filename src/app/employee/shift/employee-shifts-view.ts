import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {ActivatedRoute} from "@angular/router";
import  {EmployeeShiftsStore, actions} from './store';

@Component({
    selector   : 'employee-shifts-view',
    templateUrl: './employee-shifts-view.html',
})
export class EmployeeShiftsView {

    public state:any = {};

    @Input()
    public employeeId;

    constructor(
        protected store:EmployeeShiftsStore
    ) {}
    ngOnInit(){
        this.store.onChange((state)=>{
            this.state = state;
        });
    }
}
