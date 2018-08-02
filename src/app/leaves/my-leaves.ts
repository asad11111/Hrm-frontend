import {Component, Input, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {AuthService} from "../auth/auth.service";
import {ToastsManager} from "ng2-toastr";
import {Confirm} from "../shared/components/confirm";


@Component({
    selector: 'my-leaves',
    templateUrl: './my-leaves.html',
})
export class MyLeaves {

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

    @ViewChild('confirm')
    public confirm:Confirm;

    protected res:any;

    public leaves = [];

    public leave = null;

    public leaveModal:any = {
        show: false,
        employees: {},
        designations: {},
        departments: {},
        leave: {},
        requests: []
    };

    public fetching = false;

    public fetched = false;

    public employee_configs:any = {};

    public stats:any = {
        leavesCount: '?',
        totalLeaves: '?'
    };

    constructor(public http: Http,public auth:AuthService, public toastr:ToastsManager) {
    }

    ngOnInit() {
        this.fetching = true;
        this.http.get('/attendance/api/v1/leaves/submitted_by_me', {}).subscribe((res) => {
            this.fetching = false;
            this.fetched = true;
            this.leaves = res.json().data.leaves;
        }, (res) => {

        });


        if(this.auth.hasModule('NZ-Payroll')){
            this.http.get(`/nz-payroll/api/v1/employee_configrations`).subscribe(
                (res) => {
                    this.employee_configs = res.json().data;
                    let employee_id = this.auth.data.employee.id;
                    this.http.get(`/attendance/api/v1/leaves/count?employee_type=${this.employee_configs.employee_type}&employee_id=${employee_id}`).subscribe((res)=>{
                        this.stats  = res.json().data;
                        if(this.employee_configs.use_emp_leaves == 1){
                            this.stats.totalLeaves = this.employee_configs.bareavement_leaves + this.employee_configs.annual_leaves + this.employee_configs.sick_leaves;
                        }
                    });
                }
            );
        } else {
            let employee_id = this.auth.data.employee.id;
            this.http.get(`/attendance/api/v1/leaves/count?employee_id=${employee_id}`).subscribe((res)=>{
                this.stats  = res.json().data;
            });
        }
    }
    show(e, leave){
        e.preventDefault();
        this.http.get(`/attendance/api/v1/leaves/${leave.id}`).subscribe((res)=>{
            this.leaveModal = Object.assign(this.leaveModal, res.json().data, {show: true})
        });
    }
    edit(leave){
        this.http.get(`/attendance/api/v1/leaves/${leave.id}/edit`).subscribe((res)=>{
            this.leave = res.json().data;
        });
    }
    created(leave){
        this.leaves.unshift(leave);
        let subject = leave.subject;
        this.leave = null;
        this.toastr.success(`${subject} has been successfully submitted`, 'Leave');
    }
    updated(leave){
        let subject = leave.subject;
        let index = this.leaves.findIndex((l)=>{
            return l.id === leave.id;
        });
        this.leaves[index] = leave;
        this.leave = null;
        this.toastr.success(`${subject} has been successfully updated`, 'Leave');
    }
    destroy(leave){
        this.confirm.show(`Are you sure you want to delete ${leave.subject}`).then((opt)=>{
            if(opt === false) return;
            this.http.delete(`/attendance/api/v1/leaves/${leave.id}`).subscribe(()=>{
                this.leaves = this.leaves.filter((l)=>{
                    return l.id !== leave.id;
                })
            });
        });
    }
}
