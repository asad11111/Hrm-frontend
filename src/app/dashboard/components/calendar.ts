import {Component, OnInit, ViewChild} from '@angular/core';
import {Http} from "@angular/http";

@Component({
    selector: 'calendar',
    templateUrl: './calendar.html'
})
export class Calendar implements OnInit {

    @ViewChild('calendar')
    public calendar;
    constructor(protected http:Http) {    }
    ngOnInit() {
        this.initCalendar();
    }
    initCalendar(){
        $(this.calendar.nativeElement).fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month'
            },
            displayEventTime: false,
            aspectRatio:0.8,
            events: (start, end, tz, callback)=>{
                var start = start.format();
                var end = end.format();
                this.http.get(`/attendance/api/v1/calendar?start=${start}&end=${end}`).subscribe((res)=>{

                    var holidays = res.json().data.holidays.map((holiday)=>{
                        return {
                            title: holiday.title,
                            start: holiday.date,
                            end: holiday.date,
                            color: '#357CA5'
                        };
                    });

                    var leaves = res.json().data.leaves.map((leave)=>{
                        return {
                            title: leave.subject,
                            start: leave.start_date,
                            end: leave.end_date,
                            color: '#00A65A' }
                    });

                    callback(holidays.concat(leaves));

                });
            }
        });
    }
}