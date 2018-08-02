import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
var {Chart} = require('chart.js');

@Component({
    selector: 'overall-review-score',
    templateUrl: './template.html'
})
export class OverallReviewScore {

    @ViewChild('chartRef')
    public chartRef:ElementRef;

    constructor() {

    }
    ngAfterViewInit() {

        var lineData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "Example dataset",
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "Example dataset",
                    fillColor: "rgba(26,179,148,0.5)",
                    strokeColor: "rgba(26,179,148,0.7)",
                    pointColor: "rgba(26,179,148,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(26,179,148,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };
        var chart = new Chart(this.chartRef.nativeElement,{
            type: 'line',
            data: lineData
        });
    }

}