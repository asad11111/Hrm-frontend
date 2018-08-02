import {Component, OnInit, ViewChild, ElementRef, Input, EventEmitter, Output} from '@angular/core';
import moment = require("moment");
import {Router} from "@angular/router";
import {Permission} from "../../auth/permission.service";
var {Chart} =  require('chart.js');

/**
 *  0: 'Pending',
        1: 'Approved',
        2: 'Rejected'
 */
@Component({
    selector: 'leave-pie',
    templateUrl: './leave-pie.html',
})
export class LeavePie {

    @ViewChild('leavepieel') 
    public leavepieel;

    public _data = [];
    public data =  [];

    public _current = 'today';
  
    public constructor(public router:Router, public permissions:Permission){
        this.data = [{
            absent : 2,
            leave : 5,
            total : 10,
        }];
        
      }
  
      ngAfterViewInit(){
        this.plotPie([5,3,5]);
      }  
    plotPie(index) {
       // if(this.data.length === 0) return;
        //let set = this.data[index];
        let data = {
            labels: [
                "Total Leaves",
                "Approved",
                "Pending",
            ],
            datasets: [
                {
                    data: [  5,2,3 ],
                    backgroundColor: [
                        '#75D2C0',
                        '#F4A5AD',
                        '#8DCEF2',
                    ]
                }]
        };

        console.log( this );

        new Chart(this.leavepieel.nativeElement, {
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
        this.router.navigate(['/', 'attendance', 'reports'], {
            queryParams: {date: date, report: 'daily'}
        })
    }
}