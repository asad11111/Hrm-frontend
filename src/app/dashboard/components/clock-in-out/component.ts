import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import 'rxjs/add/operator/retry';

@Component({
    selector: 'clock-in-out',
    templateUrl: './template.html'
})
export class ClockInOut {

    public clocking = false;

    @Input()
    public data;

    constructor(protected http:Http) {
    }
    clockIn() {
        this.clocking = true;
        this.http.get('/attendance/api/v1/clock/in')
        .retry(2)
        .subscribe((res) => {
            this.data = res.json().data;
            this.clocking = false;
        });
    }
    clockOut() {
        this.clocking = true;
        this.http.get('/attendance/api/v1/clock/out')
        .retry(2)
        .subscribe((res) => {
            this.data = res.json().data;
            this.clocking = false;
        });
    }
    canClockIn() {
        // if (this.clocks.length == 0) return true;
        // this.data = Object.assign(this.data, res.json().data);
        // return attendance.out_at != null;
    }
}