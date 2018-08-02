import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {Http} from "@angular/http";
import {AuthService} from "../../../auth/auth.service";
import {Permission} from "../../../auth/permission.service";

@Component({
    selector: 'leave-type-modal',
    templateUrl: './LeaveTypeModal.html'
})
export class LeaveTypeModal implements OnInit {

    public _leaveType;

    @Input()
    public set leaveType(val){
        this._leaveType = val;
        this.errors = {};
    }
    public get leaveType(){
        return this._leaveType;
    }

    @Output()
    public onCreate = new EventEmitter();

    @Output()
    public onUpdate = new EventEmitter();

    @Output()
    public onHide = new EventEmitter();

    public errors = {};

    constructor(public http:Http, public auth:AuthService, public permission:Permission) {

    }
    ngOnInit() {

    }
    save(){
        this.leaveType.id ? this.update() : this.create();
    }
    create(){
        this.http.post('/attendance/api/v1/leave_types',this.leaveType).subscribe((res)=>{
            this.onCreate.emit(res.json().data);
        }, (res)=>{
            if(res.status !== 422) return;
            this.errors = res.json().errors;
        });
    }
    update(){
        var id = this.leaveType.id;
        this.http.put(`/attendance/api/v1/leave_types/${id}`, this.leaveType).subscribe((res)=>{
            this.onUpdate.emit(res.json().data);
        }, (res)=>{
            if(res.status !== 422) return;
            this.errors = res.json().errors;
        });
    }

}

