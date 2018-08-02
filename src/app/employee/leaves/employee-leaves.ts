import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {AuthService} from "../../auth/auth.service";
import {ToastsManager} from "ng2-toastr";
import {ActivatedRoute} from "@angular/router";
import * as moment from 'moment';


@Component({
    selector: 'employee-leaves',
    templateUrl: './employee-leaves.html',
})
export class EmployeeLeaves {

    public labelClasses = {
        0: 'label-warning',
        1: 'label-success',
        2: 'label-danger'
    };

    public status:any = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected'
    };

    protected res:any;

    public leaves = [];

    public employee:any = {};

    public designation:any = {};

    public department:any = {};

    public fetching = false;

    public fetched = false;

    public employee_configs:any = {};

    public stats:any = {
        leavesCount: '?',
        totalLeaves: '?'
    };

    constructor(
        public http: Http,
        public auth:AuthService,
        public toastr:ToastsManager,
        public route:ActivatedRoute
    ) {}
    ngOnInit() {
        this.fetching = true;
        this.route.params.subscribe((params:any)=>{
            this.http.get(
                `/attendance/api/v1/leaves/submitted_by?employee_id=${params.id}&include[]=employee`
            ).subscribe((res) => {
                let data = res.json().data;
                this.fetching = false;
                this.fetched = true;
                this.leaves = data.leaves;
                this.employee = data.employee;
                this.designation = data.designation;
                this.department = data.department;
            }, (res) => {

            });

            if(this.auth.hasModule('NZ-Payroll')){
                this.http.get(`/nz-payroll/api/v1/employee_configrations/`+params.id).subscribe(
                    (res) => {
                        this.employee_configs = res.json().data;
                        let employee_id = this.auth.data.employee.id;
                        this.http.get(`/attendance/api/v1/leaves/count?employee_type=${this.employee_configs.employee_type}&employee_id=${params.id}`).subscribe((res)=>{
                            this.stats  = res.json().data;
                            if(this.employee_configs.use_emp_leaves == 1){
                                this.stats.totalLeaves = this.employee_configs.bareavement_leaves + this.employee_configs.annual_leaves + this.employee_configs.sick_leaves;
                            }
                        });
                    }
                );
            } else {
                //let employee_id = this.auth.data.employee.id;
                this.http.get(`/attendance/api/v1/leaves/count?employee_id=${params.id}`).subscribe((res)=>{
                    this.stats  = res.json().data;
                });
            }
        });
    }
    getDuration(start, end){
        var days = moment(end).diff(moment(start), 'days');
        return days;
    }
    destroy(id){

    }
}
