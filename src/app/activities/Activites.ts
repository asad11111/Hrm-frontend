import {Component} from '@angular/core';
import {Http} from "@angular/http";
import moment = require("moment");
import {dateFormat} from "../shared/constants";
import {ActivitiesHelper} from "./ActivitiesHelper";


@Component({
    selector: 'activities',
    templateUrl: './Activities.html',
})
export class Activities {

    fetched = false;

    fetching = false;

    activities = [];

    employees:any = {};

    date = moment().format(dateFormat);

    constructor(public http:Http, public helper:ActivitiesHelper){
        this.fetch(this.date);
    }
    ngOnInit(){

    }
    getPicUrl(employee_id){
        let employee = this.employees[employee_id];
        let id = employee.image_id || 0;
        return `/core/api/v1/images/${id}`;
    }
    fetch(date){
        this.fetching = true;
        this.fetched = false;
        this.date = date;
        let params = {date};
        this.http.get('/core/api/v1/activities', {search: params}).subscribe((res)=>{
            this.fetching = false;
            this.fetched = true;
            let data = res.json().data;
            this.activities = data.activities;
            this.employees = data.employees;
        }, ()=>{
            this.fetching = false;
        });

    }


}


