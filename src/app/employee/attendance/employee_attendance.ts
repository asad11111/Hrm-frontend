import {Component, Input, ViewChild, ElementRef} from '@angular/core';
import {Http, URLSearchParams, RequestOptions} from "@angular/http";
import {AuthService} from "../../auth/auth.service";
import {Permission} from "../../auth/permission.service";
import {ActivatedRoute} from "@angular/router";
declare var require:any;
var moment = require('moment');
declare var google:any;

@Component({
    selector   : 'employee-attendance',
    templateUrl: './employee_attendance.html',
})
export class EmployeeAttendance {

    @ViewChild('attendanceDonut')
    public attendanceDonut:ElementRef;

    public shifts = [];

    public shift_id;

    public attendance = [];

    public employee_id;

    public employee:any = {};

    public designation:any = {};

    public months = [];

    public years = [];

    public month;

    public  year;

    public fetching = false;

    public fetched = false;

    public report = {
        attendance: []
    };

    protected errors:any;

    constructor(
        protected http: Http,
        protected auth:AuthService,
        protected permission:Permission,
        protected route:ActivatedRoute
    ) {
        this.months = [
            'January', 'February', 'March',
            'April', 'May', 'June', 'July',
            'August', 'September', 'October',
            'November','December'
        ];
        this.month = (new Date()).getMonth() + 1;
        var year = (new Date()).getFullYear();
        this.years = [0,1,2,3,4,5,6,7,8,9].map((i)=>{
            return year - i;
        });
        this.year = year;
    }
    ngOnInit(){
        this.route.params.subscribe((params:any)=>{
            var employee_id = params.id;
            this.fetchEmployee(employee_id);
            this.fetchShifts(employee_id)
        });
    }
    fetch(){
        this.fetching = true;
        var params = new URLSearchParams();
        params.append('employee_id', this.employee_id);
        params.append('month', this.month);
        params.append('year', this.year);
        var opts = new RequestOptions({search:params});
        this.http.get(`attendance/api/v1/monthly_stats`, opts)
        .subscribe((res)=>{
            this.report = res.json().data;
            this.fetched = true;
            this.fetching = false;
        }, ()=>{
            this.fetching = false;
        });
    }
    fetchEmployee(employee_id){
        this.http.get(
            `/core/api/v1/employees/getById?id=${employee_id}&include[]=designation`
        ).subscribe((res)=>{
            var data = res.json().data;
            this.employee = data.employee;
            this.designation = data.designation;
            this.employee_id = employee_id;
        });
    }
    fetchShifts(employee_id){
        this.http.get(`/attendance/api/v1/employees/${employee_id}/shifts`).subscribe((res)=>{
            this.shifts = res.json().data.map((d)=>{
                return d.shift;
            });
            if(this.shifts.length) this.shift_id = this.shifts[0].id;
        });
    }
    minutesToReadable(minutes){
        if(!minutes) return 'Nah';
        if(minutes >= 60){
            var h = Math.floor( minutes / 60);
            var m = minutes % 60;
            var hh = h < 10 ? '0' + h : h;
            var mm = m < 10 ? '0' + m : m;
            return `${hh}:${mm}`;
        }
        return minutes.toString() + ' minutes';
    }
    getStatusLabelClass(status){
        if(status == 'Present'){
            return 'label-success';
        }
        if(status == 'Absent'){
            return 'label-danger';
        }
        return 'label-info';
    }
    plotDonutChart(data)
    {
        // var chartData = [
        //     ['Shift', 'Worked']
        // ];
        // for (var shiftName in data){
        //     chartData.push([shiftName, data[shiftName].elapsed]);
        // }
        // google.charts.load("current", {packages:["corechart"]});
        // google.charts.setOnLoadCallback(() => {
        //     var options = {
        //         title: 'My Daily Activities',
        //         pieHole: 0.4,
        //     };
        //     var chart = new google.visualization.PieChart(this.attendanceDonut.nativeElement);
        //     chart.draw(google.visualization.arrayToDataTable(chartData), options);
        // });
    }
}
