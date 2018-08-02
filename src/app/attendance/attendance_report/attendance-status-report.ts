import {Component, Input, ViewChild, ElementRef} from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";
import * as moment from 'moment';
import {RequestOptions} from "@angular/http";
import {TableToCsv} from "../../shared/services/table-to-csv";

@Component({
    selector   : 'attendance-status-report',
    templateUrl: './attendance-status-report.html',
})
export class AttendanceStatusReport {

    public fetched = false;

    public fetching = false;

    public departments = [{id: 0, name: 'All'}];

    public department_id:any = 0;

    public employees = [{id: 0, first_name: 'All'}];

    public employee_id:any = 0;

    public start_date = moment().format('YYYY-MM-DD');

    public end_date = moment().format('YYYY-MM-DD');

    public dateRange:any = [];

    public data:any = {
        employees: [],
        report: {}
    };

    @ViewChild('table')
    public tableRef:ElementRef;

    constructor(public http:Http, public tableToCsv:TableToCsv){}

    ngOnInit(){
        this.http.get('/core/api/v1/departments/list')
        .retry(2)
        .subscribe((res)=>{
            this.departments = this.departments.concat(res.json().data);
        });
    }
    fetchReport() {
        this.fetching = true;
        this.fetched = false;
        let params = new URLSearchParams();
        params.set('department_id', this.department_id);
        params.set('start_date', this.start_date);
        params.set('end_date', this.end_date);
        this.http.get(`/attendance/api/v1/status_report`, {search: params})
        .retry(2)
        .subscribe((res)=>{
            this.fetching = false;
            this.fetched = true;
            this.data = res.json().data;
            this.generateDateRange();
        },()=>{
            this.fetching = false;
            this.fetched = true;
        })
    }
    generateDateRange() {
        let start = moment(this.start_date);
        let end = moment(this.end_date);
        let dates = [];
        while (end.diff(start, 'days') != -1){
            dates.push(start.format('D, MMM'));
            start.add(1, 'day');
        }
        this.dateRange = dates;
    }
    toCsv(){
        let filename = 'attendance-hours-report.csv';
        this.tableToCsv.make(this.tableRef.nativeElement, filename);
    }
}
