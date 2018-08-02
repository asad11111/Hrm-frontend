import {Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
var {Chart} =  require('chart.js');

@Component({
    selector: 'overall-attendance-statistics',
    templateUrl: './OverallAttendanceStatistics.html'
})
export class OverallAttendanceStatistics {

    @ViewChild('donut')
    public donut:ElementRef;

    public index = 0;

    public _attendance = [];

    @Input()
    public set attendance(val){
        this._attendance = val;
        this.plotPie();
    }
    public get attendance(){
        return this._attendance;
    }
    public setIndex(index){
        this.index = index;
        this.plotPie();
    }

    plotPie() {
        if(this.attendance.length === 0) return;
        let set = this.attendance[this.index];
        let data = {
            labels: [
                "Presences",
                "Absentees",
                "Leaves",
                "Holidays"
            ],
            datasets: [
                {
                    data: [set.presents, set.absents, set.leaves,  set.holidays],
                    backgroundColor: [
                        '#8DCEF2',
                        '#F4A5AD',
                        '#75D2C0',
                        '#BABABA'
                    ]
                }]
        };
        new Chart(this.donut.nativeElement, {
            type: 'doughnut',
            data: data,
            options: {
                legend: {
                    position: 'right'
                }
            }
        });
    }
}