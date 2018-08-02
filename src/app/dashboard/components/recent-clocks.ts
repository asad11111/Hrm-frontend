import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import './recent-clocks.css';
import moment = require("moment");
import {Router} from "@angular/router";
import {Permission} from "../../auth/permission.service";

@Component({
    selector: 'recent-clocks',
    templateUrl: './recent-clocks.html'
})
export class RecentClocks {

    public deviceClasses = {
        1: 'sprite-clock-in-desktop',
        2: 'sprite-clock-in-mobile',
        3: 'sprite-clock-in-bio',
    };

    @Output()
    public fetchRecentClocks = new EventEmitter();

    public _current = 'today';

    public set current(val){
        this._current = val;
        if(this._current !== val){
            this.fetchRecentClocks.emit(val);
        }
    }
    public get current(){
        return this._current;
    }

    @Input()
    public data = {
        clocks: [],
        employees: {}
    };

    public constructor(public router:Router, public permissions:Permission)
    {
    }
    public getEmployeeImage(employee_id)
    {
        let employee =  this.data.employees[employee_id];
        if(!employee) return '';
        let image_id = employee.image_id || 0;
        return `/core/api/v1/images/${image_id}`;
    }
    navigateMore()
    {
        let date = moment().format('YYYY-MM-DD');
        if(this.current === 'yesterday'){
            date = moment().subtract(1, 'day').format('YYYY-MM-DD');
        }
        this.router.navigate(['/', 'attendance', 'reports'], {
            queryParams: {date: date, report: 'daily'}
        })
    }
}