import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
var {Chart} = require('chart.js');

@Component({
    selector: 'overall-leaves-holidays-heatmap',
    templateUrl: './template.html'
})
export class OverallLeavesHolidaysHeatMap {

    @ViewChild('leavesRef')
    leavesRef:ElementRef;

    @ViewChild('holidaysRef')
    holidaysRef:ElementRef;

    constructor() {

    }
    ngAfterViewInit() {
        this.renderSelfChart();
        this.renderAssignedChart();
    }
    renderSelfChart(){
        var data = {
            labels: [
                "Avail",
                "Working Days"
            ],
            datasets: [
                {
                    data: [50, 20],
                    backgroundColor: [
                        "#F89AA5",
                        "#FBC1C8"
                    ]
                }]
        };
        new Chart(this.leavesRef.nativeElement, {
            type: 'doughnut',
            data: data,
            options: {
                title: {
                    text: 'Leaves',
                    position: 'top',
                    display: true
                },
                legend: {
                    display: true,
                    position: 'right',
                }
            }
        });
    }
    renderAssignedChart(){
        var data = {
            labels: [
                "Booked",
                "Remaining"
            ],
            datasets: [
                {
                    data: [30, 50],
                    backgroundColor: [
                        "#C3E5F8",
                        "#8DCEF2"
                    ]
                }]
        };
        new Chart(this.holidaysRef.nativeElement, {
            type: 'doughnut',
            data: data,
            options: {
                title: {
                    text: 'Holidays',
                    position: 'top',
                    display: true
                },
                legend: {
                    display: true,
                    position: 'right',
                }
            }
        });

    }

}