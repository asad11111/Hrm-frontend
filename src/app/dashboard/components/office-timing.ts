import {Component, OnInit, Input} from '@angular/core';
require('./office-timing.css');


@Component({
    selector: 'office-timing',
    templateUrl: './office-timing.html',
})
export class OfficeTiming implements OnInit {

    public index = 0;

    @Input()
    public data = [];

    constructor() {

    }

    ngOnInit() { }

    formatTime(val){
        if(val){
            val = val.split(' ');
            return `${val[0]} <small>${val[1]}</small>`;
        }
        return '00:00 <small>--</small>'
    }

}