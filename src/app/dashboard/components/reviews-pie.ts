import {Component, OnInit, ViewChild, ElementRef,Input} from '@angular/core';
var {Chart} =  require('chart.js');
@Component({
    selector: 'reviews-pie',
    templateUrl: './reviews-pie.html',

})
export class ReviewsPie implements OnInit {

    @ViewChild('pie')  public pie:ElementRef;

    public _performData;

    @Input()
    public set performData(val){
        this._performData = val;
        if(typeof val['reviews-pie']!= 'undefined')
            this.loadData( val['reviews-pie'] );   
       
    } ;
    public get performData(){
        return this._performData;
    }

    constructor() {  
       
      }

     ngOnInit() {  }  

    loadData=(d)=>{
         var date_points=[d.assigned  ,d.pending,d.completed];
                 var chartData = {
                                labels: [
                                    "Assigned",
                                    "Pending",
                                    "Comp."
                                ],
                                datasets: [
                                    {
                                        data: date_points,
                                        backgroundColor: [
                                            "#8DCEF2",
                                            "#FAB4BC",
                                            "#00B493"]
                                    }]
                            };
                            new Chart(this.pie.nativeElement, {
                                type: 'pie',
                                data: chartData,
                                options: {
                                    legend: {
                                        position: 'bottom'
                                    }
                                }
                            }); 
     }
}