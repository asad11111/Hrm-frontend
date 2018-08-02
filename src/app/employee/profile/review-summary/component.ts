import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
var Chart = require('chart.js');

@Component({
    selector: 'review-summary',
    templateUrl: './template.html'
})
export class ReviewSummary {

    @ViewChild('self')
    selfRef:ElementRef;

    @ViewChild('assigned')
    assignedRef:ElementRef;

    constructor() { }

    ngAfterViewInit() {
        this.renderSelfChart();
        this.renderAssignedChart();
    }
    renderSelfChart(){
        var data = {
            labels: [
                "Pending",
                "Completed"
            ],
            datasets: [
                {
                    data: [50, 20],
                    backgroundColor: [
                        "#FAB4BC",
                        "#00B493"
                    ]
                }]
        };
        new Chart(this.selfRef.nativeElement, {
            type: 'pie',
            data: data,
            options: {
                title: {
                    text: 'Employee reviews',
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
                "Pending",
                "Completed"
            ],
            datasets: [
                {
                    data: [30, 50],
                    backgroundColor: [
                        "#FAB4BC",
                        "#00B493"
                    ]
                }]
        };
        new Chart(this.assignedRef.nativeElement, {
            type: 'pie',
            data: data,
            options: {
                title: {
                    text: 'Assigned Reviews',
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