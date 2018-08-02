import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'dashboard-stats-item',
    templateUrl: './dashboard-stats-item.html'
})
export class DashboardStatsItem implements OnInit {

    @Input()
    public title;

    @Input()
    public fig;

    @Input()
    public label;

    @Input()
    public percentage;

    @Input()
    public icon;

    @Input()
    public bg;

    constructor() { }

    ngOnInit() { }

}