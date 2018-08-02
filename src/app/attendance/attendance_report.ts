import {Component, Input, ViewChild} from '@angular/core';
import {Http, URLSearchParams , Headers} from "@angular/http";
import {NgbTabset} from "../shared/components/tabs/tabset";
import {ActivatedRoute} from "@angular/router";
import {Permission} from "../auth/permission.service";
import {HttpClient, PaginatedResult, RequestStatus} from "../shared/services/Http";
import {Employee} from "../employee/Employee";
import {fadeInAnimation} from "../shared/animations/animations";
import {AuthService} from '../auth/auth.service';

export class MonthlyReportResponse {
    employees =  new PaginatedResult<Employee[]>();
    reports = [];
}

export class DailyReportResponse {
    employees =  new PaginatedResult<Employee[]>();
    reports = [];
}

@Component({
    selector   : 'attendance-report',
    templateUrl: './attendance_report.html',
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class AttendanceReport {

    @ViewChild('tabs')
    tabs:NgbTabset;

    public dailyReport:any = {
        data: new DailyReportResponse(),
        fetching: new RequestStatus(),
    };
    public monthlyReport = {
        data: new MonthlyReportResponse(),
        fetching: new RequestStatus(),
    };
    public employeeReport = {
        data: {},
        fetching: new RequestStatus(),
    };
    public departments:any = [{id: 0, name: 'All'}];

    public constructor(
        public http:Http,
        public httpClient:HttpClient,
        public route:ActivatedRoute,
        public permissions:Permission,
        public auth:AuthService
    ){

    }
    public ngAfterViewInit()
    {
        this.route.queryParams.subscribe((params:any)=>{
            let active = (params.report || 'daily');
            this.tabs.select(active);
        });
    }

    public selected()
        {

        }
    fetchDailyReport(opts)
    {
        let req = this.httpClient.get('/attendance/api/v1/daily_report', {params: opts});
        this.dailyReport.fetching = req.status;
        req.setTimeout(10000);
        req.send().subscribe((res)=>{
            this.dailyReport.data = res.json().data;
            req.setTimeout(10000);
        }, ()=>{
            req.setTimeout(10000);
        });
    }
 
    fetchMonthlyReport(opts){
       
        let req = this.httpClient.get('/attendance/api/v1/monthly_report', {params: opts});
        this.monthlyReport.fetching = req.status;
        req.setTimeout(40000);
        req.send().subscribe((res)=>{
            this.monthlyReport.data = res.json().data;
            req.resetsetTimeout();
        }, (res)=>{
            req.resetsetTimeout();
        });
    }
    fetchEmployeeReport(opts) {
        let req = this.httpClient.get(`/attendance/api/v1/employee_report`, {params: opts});
        this.employeeReport.fetching = req.status;
        req.setTimeout(10000);
        req.send().subscribe((res)=>{
            this.employeeReport.data = res.json().data;
            req.resetsetTimeout();
        }, ()=>{
            req.resetsetTimeout();
        });
    }
}
