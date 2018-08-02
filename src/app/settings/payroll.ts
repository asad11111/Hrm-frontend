import {Component, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {AuthService} from "../auth/auth.service";
import {ToastsManager} from "ng2-toastr";

interface default_configs {
    work_day_in_week: number;
    sick_leaves: number;
    annual_leaves: number;
    bareavement_leaves: number;
    public_holidays: number;
    alternate_holiday: number;
    pay_rate_type: string;
    emplyee_tax_code: string;
    kiwisaver_member: number;
    employeer_kiwisaver_contribution: number;
    employee_kiwisaver_contribution: number;
    paye_tax_rate: number;
}

interface employeer_configs {
    work_day_in_week: number;

    p_sick_leaves: number;
    p_annual_leaves: number;
    p_bareavement_leaves: number;

    c_sick_leaves: number;
    c_annual_leaves: number;
    c_bareavement_leaves: number;
    
    alternate_holiday: number;
    pay_rate_type: string;
    kiwisaver_member: number;
    employeer_kiwisaver_contribution: number;
    employeer_ird: string;
    office_id: number;
    employee_id: number;
}

@Component({
    selector: 'settings-payroll',
    templateUrl: './payroll.html',
})
export class SettingsPayroll {

    public error: any = {
        show:false,
        message: ''
    };

    public default_configs: default_configs = {
        work_day_in_week: 5,
        sick_leaves: 5,
        annual_leaves: 20,
        bareavement_leaves: 0,
        public_holidays: 11,
        alternate_holiday: 1,
        pay_rate_type: 'Hour',
        emplyee_tax_code: 'M',
        kiwisaver_member:1,
        employeer_kiwisaver_contribution: 3,
        employee_kiwisaver_contribution: 3,
        paye_tax_rate: 5
    };

    public employeer_configs: employeer_configs = {
        work_day_in_week: 5,
        
        p_sick_leaves: 5,
        p_annual_leaves: 20,
        p_bareavement_leaves: 0,

        c_sick_leaves: 5,
        c_annual_leaves: 0,
        c_bareavement_leaves: 0,

        alternate_holiday: 1,
        pay_rate_type: 'Hourly',
        kiwisaver_member:1,
        employeer_kiwisaver_contribution: 3,
        employeer_ird: '0',
        office_id: 0,
        employee_id: 0
    };

    constructor(
        protected http:Http,
        protected auth:AuthService,
        protected toastr:ToastsManager
    ){}

    ngOnInit() {
        this.error.show = false;
        this.http.get('/nz-payroll/api/v1/default_configrations').subscribe((res) => {
            this.default_configs = res.json().data;
        });
        
        this.http.get('/nz-payroll/api/v1/employeer_configrations').subscribe(
            (res) => {
                this.employeer_configs = res.json().data;
            }, 
            (err) => {
                this.http.post(`/nz-payroll/api/v1/employeer_configrations`, this.employeer_configs).subscribe(
                    (res) => {
                        this.employeer_configs = res.json().data;
                    }
                );
            }
        );
    }

    update(){
        this.error.show = false;
        this.http.post(`/nz-payroll/api/v1/employeer_configrations`, this.employeer_configs).subscribe(
            (res) => {
                this.update_leave_types({"name" : "Annual Leaves", "allowed" : this.employeer_configs.p_annual_leaves, "employee_type" : "1"});
                this.update_leave_types({"name" : "Sick Leaves", "allowed" : this.employeer_configs.p_sick_leaves, "employee_type" : "1"});
                this.update_leave_types({"name" : "Bareavement Leaves", "allowed" : this.employeer_configs.p_bareavement_leaves, "employee_type" : "1"});

                this.update_leave_types({"name" : "Annual Leaves", "allowed" : this.employeer_configs.c_annual_leaves, "employee_type" : "2"});
                this.update_leave_types({"name" : "Sick Leaves", "allowed" : this.employeer_configs.c_sick_leaves, "employee_type" : "2"});
                this.update_leave_types({"name" : "Bareavement Leaves", "allowed" : this.employeer_configs.c_bareavement_leaves, "employee_type" : "2"});
                
                this.toastr.success(`Configurations Saved Successfully`, 'Configurations');
            },
            (err) => {
                var err_data = err.json().errors;
                var errors = '';

                for(let key in err_data){
                    errors += err_data[key][0] + '<br />';
                }

                this.error.show = true;
                this.error.message = errors;
            }
        );
    }

    update_leave_types(leave_object){
        this.http.post(`/attendance/api/v1/nz_leave_type`, leave_object).subscribe(
            (res) => {

            }
        );
    }
}

