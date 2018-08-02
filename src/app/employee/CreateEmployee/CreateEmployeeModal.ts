import {Component, Input, EventEmitter, Output, Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {AuthService} from "../../auth/auth.service";
import {Permission} from "../../auth/permission.service";
import {Router} from '@angular/router';
import {ToastsManager} from "ng2-toastr";
import {CreateEmployeeModalState} from "./CreateEmployeeState";
import {EmployeeStore} from "../EmployeeStore";
import {FetchedArrayResult} from "../../shared/Fetch";
import {Designation} from "../../designation/Designation";
import {Employee, Role} from "../Employee";


@Component({
    selector   : 'create-employee-modal',
    templateUrl: './CreateEmployeeModal.html',
})
export class CreateEmployeeModal {

    public showPicModal = false;

    public picSrc = '/core/api/v1/employees/0/pic';

    @Input()
    public state:CreateEmployeeModalState;

    @Input()
    public designations = new FetchedArrayResult<Designation>();

    @Input()
    public departments = new FetchedArrayResult<Designation>();

    @Input()
    public roles = new FetchedArrayResult<Role>();

    @Input()
    public employees = new FetchedArrayResult<Employee>();

    public employeer_pay_rate_type = '';

    constructor(
        protected http: Http,
        protected auth:AuthService,
        protected permission:Permission,
        protected router:Router,
        protected toastr:ToastsManager,
        public store:EmployeeStore
    ){}
    ngOnInit(){
        // this.http.get('/core/api/v1/employees/list').subscribe((res)=>{
        //     this.employees = res.json().data;
        // });
        // this.http.get('/core/api/v1/roles/list').subscribe((res)=>{
        //     this.roles = res.json().data;
        // });
        
        if(this.auth.hasModule('NZ-Payroll')){
            this.http.get('nz-payroll/api/v1/employeer_configrations')
            .subscribe(
                (res)=>{
                    let r = res.json().data.pay_rate_type;
                    if(r == 'Hourly') this.employeer_pay_rate_type = 'hour';
                    if(r == 'Daily') this.employeer_pay_rate_type = 'day';
                    if(r == 'Weekly') this.employeer_pay_rate_type = 'week';
                    if(r == 'Fortnightly') this.employeer_pay_rate_type = '2 weeks';
                    if(r == 'Monthly') this.employeer_pay_rate_type = 'month';
                }
            );

        }
    }
    save(){
        // let data = toFormData({
            // employee: this.employee
        // });

        // this.http.post('/core/api/v1/employees', data).subscribe((res)=>{
            // this.errors = {};
            // this.onCreate.emit(res.json().data);
        // }, (res)=>{
            // if(res.status != 422) return;
            // this.errors = res.json().errors;
        // }, ()=>{
            // this.toastr.success('successfully created', 'Employee')
        // });
    }
    setImage(src){
        // this.picSrc = src;
        // this.employee.pic = uriToBlob(src);
    }
    cancel(){
        // this.errors = {};
        // this.onCancel.emit();
    }
}
