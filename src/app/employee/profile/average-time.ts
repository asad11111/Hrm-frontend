import './average-time.css';
import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'profile-avg-time',
    templateUrl: 'average-time.html'
})
export class ProfileAvgTime implements OnInit {

    public inOutIndex = 0;

    public inTimeIndex = 0;

    @Input()
    public inOutTime = [];

    @Input()
    public inTime = [];

    constructor() {

    }
    ngOnInit() {

    }
    formatTime(val){
        if(val){
            val = val.split(' ');
            return `${val[0]} <small>${val[1]}</small>`;
        }
        return '00:00 <small>--</small>'
    }

}