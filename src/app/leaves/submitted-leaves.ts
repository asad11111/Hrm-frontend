import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";


@Component({
    selector: 'submitted-leaves',
    templateUrl: './submitted-leaves.html',
})
export class SubmittedLeaves {

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

    public leaveModal = {
        show: false,
        employees: {},
        designations: {},
        departments: {},
        leave: {},
        requests: []
    };

    protected http: Http;

    protected errors: any;

    protected res:any;

    public leaves = [];

    public leave = null;

    public fetching = false;

    public fetched = false;

    constructor(http: Http) {
        this.res = {
            data: []
        };
        this.http = http;
        this.errors = {};
    }

    ngOnInit() {
        this.fetching = true;
        this.http.get('/attendance/api/v1/leaves/submitted_to_me', {}).subscribe((res) => {
            this.fetching = false;
            this.fetched = true;
            this.leaves = res.json().data.leaves;
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });
    }
    destroy(id){
        let opt = confirm('Are you sure you to remove?');
        if(opt == false) return;
    }
    show(e, leave){
        e.preventDefault();
        this.http.get(`/attendance/api/v1/leaves/${leave.id}`).subscribe((res)=>{
            this.leaveModal = Object.assign(this.leaveModal, res.json().data, {show: true});
        });
    }
    onUpdate(leave){
        let index = this.leaves.findIndex((l)=>{
            return l.id === leave.id;
        });
        this.leaves[index] = leave;
        this.leaveModal.leave = leave;
    }
}

