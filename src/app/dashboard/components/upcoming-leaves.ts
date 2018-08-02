import {Component, OnInit, Input} from '@angular/core';
import './upcoming-leaves.css'
let moment = require('moment');

@Component({
    selector: 'upcoming-leaves',
    templateUrl: './upcoming-leaves.html'
})
export class UpComingLeaves {

    public status:any = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected'
    };

    public statusClasses = {
        0: 'text-warning',
        1: 'text-success',
        2: 'text-danger'
    };

    @Input()
    public data = {
        leaves: [],
        employees: {}
    };

    leavesCount(leave)
    {
        let days = moment(leave.end_date).diff(moment(leave.start_date), 'days') + 1;
        if(days > 1){
            return days + ' Days leaves';
        }
        return days + ' Day Leave';
    }
    public getEmployeeImage(employee_id)
    {
        if(!employee_id) return '';
        let image_id =  this.data.employees[employee_id].image_id;
        return `/core/api/v1/images/${image_id}`;
    }
}