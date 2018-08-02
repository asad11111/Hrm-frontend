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

    public salary_amounts:any = [];

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
        this.http.get(`/nz-payroll/api/v1/payrolls/${this.payrollId}`, {search: {page}}).subscribe((res)=>{
            let data = res.json().data;
            this.payroll = data.payroll;
            this.employees = data.employees;
            this.salarySlips = data.salary_slips;
            this.salary_amounts = data.salary_amounts;
            this.fetching = false;
            this.fetched = true;
        });
    }
    select(salarySlip){
        this.salarySlip = salarySlip;
        this.employee = this.employees[salarySlip.employee_id];
    }
    downloadPath(s){
        let path =  `nz-payroll/api/v1/salary_slips/${s.id}/download`;
        let token = localStorage.getItem('_token');
        return [path,'?token=',token].join('');
    }

    get_amount(employee_id, title){
        let amount = 0;
        for(var i = 0; i < this.salary_amounts.length; i++){
            if(this.salary_amounts[i].employee_id == employee_id && this.salary_amounts[i].title == title){
                amount = this.salary_amounts[i].amount;
                break;
            }
        }
        return amount;
    }

    get_total_(employee_id, type){
        let total = 0;
        for(var i = 0; i < this.salary_amounts.length; i++){
            if(this.salary_amounts[i].employee_id == employee_id && this.salary_amounts[i].type == type){
                total += this.salary_amounts[i].amount;
            }
        }
        return total;
    }
}
