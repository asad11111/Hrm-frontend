import {Component, OnInit, Input} from '@angular/core';
import './recent-clocks-count.css'

@Component({
    selector: 'recent-clocks-counts',
    templateUrl: './recent-clocks-counts.html'
})
export class RecentClocksCounts implements OnInit {

    @Input()
    public data = {};

    constructor() {

    }
    ngOnInit() {

    }
}