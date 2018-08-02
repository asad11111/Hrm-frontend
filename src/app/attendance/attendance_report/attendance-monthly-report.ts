import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";
import * as moment from 'moment';
import {TableToCsv} from "../../shared/services/table-to-csv";
import {RequestStatus} from "../../shared/services/Http";
import {MonthlyReportResponse} from "../attendance_report";
import {Subject} from "rxjs/Subject";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';


@Component({
    selector   : 'attendance-monthly-report',
    templateUrl: './attendance-monthly-report.html',
})
export class AttendanceMonthlyReport {

    @ViewChild('table')
    public tableRef:ElementRef;

    @Input()
    public data:MonthlyReportResponse;

    @Input()
    public fetching:RequestStatus;

    @Output()
    public onFetch = new EventEmitter();

    public from = moment().startOf('month').format('YYYY-MM-DD');

    public till = moment().format('YYYY-MM-DD');

    public onSearch = new Subject();

    public search = '';


    public constructor(public http:Http, public tableToCsv:TableToCsv){
    }
    ngOnInit(){
        this.onSearch
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe((value:string)=>{
                this.search = value || '';
                this.fetch();
            });
    }
    fetch(page=1)
    {
        if(!this.validateDateRange()) return;
        this.onFetch.emit({
            page: page,
            from: this.from,
            till: this.till,
            size: '25',
            q: this.search
        });
    }
    toCsv(){
        let filename = 'attendance-monthly-report.csv';
        this.tableToCsv.make(this.tableRef.nativeElement, filename);
    }
    validateDateRange(){
        return moment(this.till).isAfter(moment(this.from));
    }
    overTime(r){
        var total_working_hours = r.totalworkingminutes - ( (r.total_days - r.holidays) * r.shift_duration );
        return (total_working_hours > 0)?this.toHours(total_working_hours,'m'):0 ;
    }

    absent(r)
    {
        var absent =0 ;
        absent = r.absent  - r.leavesdays;
        return (absent > 0)?absent:0;
    }

    toHours(v,d){ 

        var value:any=0;
        if(parseInt(v) > 0)
        switch(d)
            {
                case 'm':
                    value =  (v - (v % 60))  / 60; 
                    value = value + ':' + (v % 60);
                break;
            }
        
        return value; }

}
