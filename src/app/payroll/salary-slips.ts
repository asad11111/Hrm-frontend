import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {ActivatedRoute} from "@angular/router";


@Component({
    selector: 'salary-slips',
    templateUrl: './salary-slips.html',
})
export class SalarySlips {

    public payrollId;

    public salarySlip = null;

    public employee = null;

    public payroll:any = {};

    public employees = [];

    public salarySlips:any = {data: []};

    public fetched = false;

    public fetching = false;

    constructor(public http:Http, public route:ActivatedRoute){
    }

    ngOnInit(){
        this.route.params.subscribe((params:any)=>{
            this.payrollId = params.id;
            this.fetch();
        });
    }
    fetch(page=1){
        this.fetched = true;
        this.http.get(`/payroll/api/v1/payrolls/${this.payrollId}`, {search: {page}}).subscribe((res)=>{
            let data = res.json().data;
            this.payroll = data.payroll;
            this.employees = data.employees;
            this.salarySlips = data.salary_slips;
            this.fetching = false;
            this.fetched = true;
        });
    }
    select(salarySlip){
        this.salarySlip = salarySlip;
        this.employee = this.employees[salarySlip.employee_id];
    }
    downloadPath(s){
        let path =  `payroll/api/v1/salary_slips/${s.id}/download`;
        let token = localStorage.getItem('_token');
        return [path,'?token=',token].join('');
    }
}
