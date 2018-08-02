import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {ToastsManager} from "ng2-toastr";

@Component({
    selector: 'leave-settings',
    templateUrl: './LeaveSettings.html',
})
export class LeaveSettings {

    public leaveType;

    public leaveTypes = [];

    public leaveApprovalTypes = [];

    public preferences:any = {};

    public savingPreferences = false;

    constructor(public http:Http, public toastr:ToastsManager){

    }
    ngOnInit()
    {
        this.http.get('/attendance/api/v1/leave_settings').subscribe((res)=>{
            let data = res.json().data;
            this.leaveTypes = data.leave_types;
            this.leaveApprovalTypes = data.approval_types;
        });
    }
    savePreferences(){
        this.savingPreferences = true;
        this.http.post('/attendance/api/v1/preferences', this.preferences).subscribe((res)=>{
            this.savingPreferences = false;
        });
    }
    created(leaveType){
        this.leaveTypes.unshift(leaveType);
        this.leaveType = null;
        this.toastr.success(`${leaveType.name} has been successfully added`, 'Leave Type');
    }
    updated(leaveType){
        var index = this.leaveTypes.findIndex((l)=>{
            return l.id === leaveType.id;
        });
        this.leaveTypes[index] = leaveType;
        this.leaveType = null;
        this.toastr.success(`${leaveType.name} has been successfully updated`, 'Leave');
    }

}
