import {Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output} from '@angular/core';
import moment = require("moment");
import {Router} from "@angular/router";
import {Permission} from "../../auth/permission.service";
var {Chart} =  require('chart.js');

@Component({
    selector: 'attendance-pie',
    templateUrl: './attendance-pie.html',

})
export class AttendancePie {

    public index = 0;

    @ViewChild('pie')
    public pie:ElementRef;

    public _data = [];

    public _current = 'today';

    public set current(val){
        if(val !== this._current){
            this.fetchData.emit(val);
        }
        this._current = val;
    }
    public get current(){
        return this._current;
    }

    @Output()
    public fetchData = new EventEmitter();

    @Input()
    public set data(val){
        this._data = val;
        if(val) this.plotPie(this.index);
    }
    public get data(){
        return this._data;
    }
    public constructor(public router:Router, public permissions:Permission){

    }
    public setIndex(index){
        if(this.index !== index){
            this.plotPie(index);
        }
        this.index = index;
    }
    plotPie(index) {
        if(this.data.length === 0) return;
        let set = this.data[index];
        let data = {
            labels: [
                "Presences",
                "Absentees",
                "Leaves",
            ],
            datasets: [
                {
                    data: [
                        set.total - (set.absent + set.leave),
                        set.absent,
                        set.leave
                    ],
                    backgroundColor: [
                        '#75D2C0',
                        '#F4A5AD',
                        '#8DCEF2',
                        // '#BABABA'
                    ]
                }]
        };
        new Chart(this.pie.nativeElement, {
            type: 'pie',
            data: data,
            options: {
                legend: {
                    position: 'right'
                }
            }
        });
    }
    navigateMore()
    {
        let date = moment().format('YYYY-MM-DD');
        // if(this.current === 'yesterday'){
        //     date = moment().subtract(1, 'day').format('YYYY-MM-DD');
        // }
        this.router.navigate(['/', 'attendance', 'reports'], {
            queryParams: {date: date, report: 'daily'}
        })
    }
}