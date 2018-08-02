import {Component} from '@angular/core'
import {ActivatedRoute} from "@angular/router";
import {Http} from "@angular/http";

@Component({
    selector   : 'employee-profile',
    templateUrl: './employee-profile.html',
})
export class EmployeeProfile {

    public data:any = {
        attendance: [],
        profileDetails: {},
        recentClocksCount: {},
        avgInOutTime: [],
        avgTimeIn: []
    };

    public shift:any = {};

    public showShiftModal = false;
 

    constructor(
        protected route:ActivatedRoute,
        protected http:Http) {
    }

    ngOnInit()
    {
        this.route.params.subscribe((params)=>{
            let id = params['id'];
            this.http.get(`/core/api/v1/employees/${id}/profile`).subscribe((res)=>{
                Object.assign(this.data, res.json().data);
            });
            this.http.get(`/attendance/api/v1/employees/${id}/profile`).subscribe((res)=>{
                Object.assign(this.data, res.json().data);
                
            })
        });
    }
}
