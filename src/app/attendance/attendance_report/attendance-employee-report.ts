import {Component, Input, ChangeDetectionStrategy, ElementRef, ViewChild, EventEmitter, Output} from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";
import * as moment from 'moment';
import {TableToCsv} from "../../shared/services/table-to-csv";
import {AuthService} from "../../auth/auth.service";
import {Permission} from "../../auth/permission.service";
import {audit} from "rxjs/operator/audit";
import {RequestStatus} from "../../shared/services/Http";
import {dateFormat} from "../../shared/constants";

@Component({
    selector   : 'attendance-employee-report',
    templateUrl: './attendance-employee-report.html',
})
export class AttendanceEmployeeReport {

    public employee_id;
    public employee:any={};

    @Input()
    public fetching:RequestStatus;

    @Input()
    public data:any = {};

    @Output()
    public onFetch = new EventEmitter();

    @Output()
    public fetchEmployees= new EventEmitter();

    public from = moment().startOf('month').format(dateFormat);

    public till = moment().format(dateFormat);

    @ViewChild('table')
    public tableRef:ElementRef;

    constructor(
        public http:Http,
        public tableToCsv:TableToCsv,
        public permissions:Permission,
        public auth:AuthService
    ) {}

    ngOnInit(){
        this.employee_id = this.auth.data.employee.id;
        this.employee = this.auth.data.employee;
    }
    fetch() {
        if(!this.validateDateRange()) return;
        this.onFetch.emit({
            'start_date': this.from,
            'end_date': this.till,
            'employee_id': this.employee_id
        });
    }
    getLabel(r){
        var total_working_hours = r.working_minutes - r.shift_duration;
        var label = "label-primary";

        if(r.holiday > 0)
            label = 'label-warning';
        
       if(total_working_hours > 0 )
            label = 'label-info';  
            
       if(r.working_minutes > 0 && r.holiday > 0 && r.workingday > 0)
            label = 'label-info'; 
       
       if(r.workingday!=1)  
            label = 'label-success';   
       
       if(r.workingday==1 && r.holiday!=1 && r.absent==1)   
            label = 'label-danger';   

       if(r.workingday==1 && r.holiday!=1 && r.leave==1)
            label = 'label-primary';     

        return label ;
    }
    getStatus(r){
        var statusText = 'Present';
        // Off Day
        // Holiday
        // Present
        // Overtime
        // Absent
        var total_working_hours = r.working_minutes - r.shift_duration;

        if(r.holiday > 0)
            statusText = 'Holiday'; 

        if(total_working_hours > 0 )
            statusText = 'Overtime';

        if(r.working_minutes > 0 && r.holiday > 0 && r.workingday > 0)
            statusText = 'Holiday / Overtime';  
        
        if(r.workingday!=1)
            statusText = 'Off Day'; 
        
        if(r.workingday!=1 && r.working_minutes )
            statusText = 'Off Day / Overtime';    

        if(r.workingday==1 && r.holiday!=1 && r.absent==1)
            statusText = 'Absent'; 
            
        if(r.workingday==1 && r.holiday!=1 && r.leave==1)
            statusText = 'Leave';     

        return statusText;
    }
    toCsv(){
        let filename = 'employee-attendance-report.csv';
        this.tableToCsv.make(this.tableRef.nativeElement, filename);
    }
    validateDateRange(){
        return moment(this.till).isSameOrAfter(moment(this.from));
    }

    overTime(r){
        var total_working_hours = r.working_minutes - r.shift_duration;
        return (total_working_hours > 0)?this.toHour(total_working_hours,'m'):0 ;
    }

    toHour(v,d){ 
        var value:any=0;
        if(parseInt(v) > 0)
        switch(d)
           {
             case 'm':
               value =  (v - (v % 60))  / 60; 
               value = value + ':' + (v % 60);
             break;
           }
        return value; 
    }

}
