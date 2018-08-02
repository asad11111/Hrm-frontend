import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Http} from "@angular/http";
import {clone} from "../../../shared/helpers";
import {AuthService} from "../../../auth/auth.service";

@Component({
    selector   : 'manage-leave-modal',
    templateUrl: './LeaveModal.html',
})
export class ManageLeaveModal {

    @Output()
    public onHide = new EventEmitter();

    @Output()
    public onUpdate = new EventEmitter();

    @Output()
    public onCreate = new EventEmitter();

    public _leave;

    public leaveTypes;

    @Input()
    public set leave(val){
        this._leave = clone(val);
        this.errors = {};
        if(val){
            this.fetchLeaveTypes();
        }
    }
    public get leave(){
        return this._leave;
    }
    public current_employee_id;

    public errors:any = {};

    constructor(protected http: Http, public auth:AuthService){
        this.current_employee_id = auth.data.employee.id;
    }
    ngOnInit(){
    }
    save(){
        this.leave.id ? this.update() : this.create();
    }
    create(){
        this.http.post('/attendance/api/v1/leaves',this.leave).subscribe((res)=>{
            this.onCreate.emit(res.json().data);
        }, (res)=>{
            if(res.status !== 422) return;
            this.errors = res.json().errors;
        });
    }
    update(){
        let id = this.leave.id;
        this.http.put(`/attendance/api/v1/leaves/${id}`, this.leave).subscribe((res)=>{
            this.onUpdate.emit(res.json().data);
        }, (res)=>{
            if(res.status !== 422) return;
            this.errors = res.json().errors;
        });
    }
    fetchLeaveTypes() {
        if(this.leaveTypes) return;
        this.http.get('/attendance/api/v1/leave_types').subscribe((res)=>{
            this.leaveTypes = res.json().data;
        });
    }
    fetchManager() {
        // if(this.manager) return;
        // var employee_id = this.auth.getUser().employee.id;
        // this.http.get(`/core/api/v1/employees/${employee_id}/manager`).subscribe((res)=>{
        //     this.manager = res.json().data;
        // });
    }
}
