import {Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
let {Chart} =  require('chart.js');
import './styles.css';
import * as moment from "moment";

@Component({
    selector: 'overall-leave-statistics',
    templateUrl: './template.html'
})
export class OverallLeaveStatistics {

    @ViewChild('donut')
    public donut:ElementRef;

    public _data;

    public pieData:any;

    public year = moment().format('YYYY');

    @Input()
    public set data(val){
        this._data = val;
        if(val) this.plotPie();
    }
    public get data(){
        return this._data;
    }
    plotPie() {

        let working_days = this.data.working_days - this.data.total_leaves;
        this.pieData=[
            {'label':"Working days","value":working_days},
            {'label':"Avail","value":this.data.leaves_count},
            {'label':"In Hand","value":this.data.total_leaves - this.data.leaves_count},           
        ];
        let data = {
            labels: [
                "Working days",
                "Avail",
                "In Hand"
            ],
            datasets: [
                {
                    data: [working_days, this.data.leaves_count, this.data.total_leaves - this.data.leaves_count ],
                    backgroundColor: [
                        '#8DCEF2',
                        '#F4A5AD',
                        '#75D2C0',
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