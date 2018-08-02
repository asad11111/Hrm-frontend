import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";
import {AuthService} from "../../auth/auth.service";
import {Permission} from "../../auth/permission.service";
import {Router, ActivatedRoute} from '@angular/router';
import {uriToBlob, toFormData} from "../../shared/helpers";
import {ToastsManager} from "ng2-toastr";
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import {Employee, Role} from "../Employee";
import {FetchedArrayResult} from "../../shared/Fetch";
import {Designation} from "../../designation/Designation";
import {EditEmployeeModalState} from "./EditEmployeeState";
import {EmployeeStore} from "../EmployeeStore";

@Component({
    selector   : 'edit-employee-modal',
    templateUrl: './EditEmployeeModal.html',
})
export class EditEmployeeModal {

    public showPicModal = false;

    @Input()
    public state = new EditEmployeeModalState();

    @Input()
    public designations = new FetchedArrayResult<Designation>();

    @Input()
    public departments = new FetchedArrayResult<Designation>();

    @Input()
    public employees = new FetchedArrayResult<Employee>();

    @Input()
    public roles = new FetchedArrayResult<Role>();

    public employeer_pay_rate_type;
    constructor(
        protected http: Http,
        protected auth:AuthService,
        protected permission:Permission,
        protected router:Router,
        protected activeRoute:ActivatedRoute,
        protected toastr:ToastsManager,
        public store:EmployeeStore
    ){
    }

    ngOnInit(){
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

    fetchData(employee_id){
    }
    save(){
    }
    getPicUrl() {
        if(this.state.imgSrc) return this.state.imgSrc;
        return `/core/api/v1/images/${this.state.employee.image_id || 0}`;
    }
    setImage(src){
        this.state.imgSrc = src;
        this.state.employee.image = uriToBlob(src);        
    }

}
