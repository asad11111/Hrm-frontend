import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'top-avg-time',
    templateUrl: './top-avg-time.html'
})
export class TopAvgTime implements OnInit {

    @Input()
    public data:any = {};

    constructor() { }

    ngOnInit() { }

    public getEmployeeImage(image_id)
    {
        return `/core/api/v1/images/${image_id}`;
    }

}