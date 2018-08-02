import {Component, OnInit} from '@angular/core';
import {Http} from "@angular/http";

@Component({
    selector: 'pending-leaves',
    templateUrl: './pending-leaves.html'
})
export class PendingLeaves implements OnInit {

    public fetching;

    public fetched;

    public leaves = [];

    public employees = {};

    constructor(public http:Http)
    {

    }
    ngOnInit()
    {
        this.fetching = true;
        this.http.get(
            `/attendance/api/v1/leaves/submitted_to_me?pending=true&include[]=employees`, {})
        .subscribe((res) => {
            this.fetching = false;
            this.fetched = true;
            this.leaves = res.json().data.leaves || [];
            this.employees = res.json().data.employees || {};
        }, (res) => {

        });

    }
}