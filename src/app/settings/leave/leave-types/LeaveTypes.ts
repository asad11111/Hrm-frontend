import {Component, Input} from '@angular/core';
import {Http} from '@angular/http';
import {ToastsManager} from "ng2-toastr";
import {leave} from "@angular/core/src/profile/wtf_impl";
import {AuthService} from "../../../auth/auth.service";
import {Permission} from "../../../auth/permission.service";

@Component({
    selector: 'leave-types',
    templateUrl: './LeaveTypes.html',
})
export class LeaveTypes {

    public leaveType;

    @Input()
    public leaveTypes = [];

    constructor(public http:Http, public toastr:ToastsManager,  public auth:AuthService, public permission:Permission){

    }
    ngOnInit()
    {
    }
    onUpdate(leaveType){
        let index = this.leaveTypes.findIndex((l) => l.id === leaveType.id);
        this.leaveTypes[index] = leaveType;
        this.leaveType = null;
    }
    onCreate(leaveType){
        this.leaveTypes.push(leaveType);
        this.leaveType = null;
    }

}
