import {Injectable} from "@angular/core";
import moment = require("moment");

@Injectable()
export class LeaveHelpers {

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

    public daysCount(leave){
        return moment(leave.end_date).diff(moment(leave.start_date), 'days') + 1;
    }


}