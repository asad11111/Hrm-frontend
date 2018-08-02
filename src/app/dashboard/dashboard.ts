import {Component, Input, ViewChild, ElementRef} from '@angular/core';
import { Http } from "@angular/http";
import { AuthService } from '../auth/auth.module';
import './dashboard.css';
import {defaultUrlMatcher} from "@angular/router/src/shared";
declare var $:any;


@Component({
	selector: 'dashboard',
	templateUrl: './dashboard.html',
})
export class Dashboard {

	public clocking = false;

	public data:any = {
		attendance: [],
		officeTimeShift: []
	};

	@ViewChild('calendar')
    public calendar:ElementRef;

	public clocks = [];

	public reviewStates:any={};

	constructor(
		protected http: Http,
		public auth: AuthService
	) {
	}
	ngOnInit() {
		this.http.get('/core/api/v1/dashboard').subscribe((res)=>{
		    Object.assign(this.data, res.json().data)
		});
		if(this.auth.hasModule('Attendance')){
			this.http.get('/attendance/api/v1/dashboard').subscribe((res)=>{
				Object.assign(this.data, res.json().data)
			});
		}
		if(this.auth.hasModule('Review')){
			this.fetchReviewStates();
		}
	}
	clockIn() {
		this.clocking = true;
		this.http.get('/attendance/api/v1/clock/in').subscribe((res) => {
			this.clocks.unshift(res.json().data);
			this.clocking = false;
		});
	}
	clockOut() {
		this.clocking = true;
		this.http.get('/attendance/api/v1/clock/out').subscribe((res) => {
			this.clocks[0] = res.json().data;
			this.clocking = false;
		});
	}
	canClockIn() {
		if (this.clocks.length == 0) return true;
		let attendance = this.clocks[0];
		return attendance.out_at != null;
	}
	fetchRecentClocks(day)
	{
        this.http.get(`/attendance/api/v1/dashboard/recent_clocks?day=${day}`)
        .subscribe((res)=>{
			this.data.recentClocks = res.json().data.recentClocks;
        });
	}
	fetchAttendanceDonut(day)
	{
		this.http.get(`/attendance/api/v1/dashboard/attendance?day=${day}`)
        .subscribe((res)=>{
            this.data.attendance = res.json().data.attendance;
        });
	}
	initCalendar(){
        $(this.calendar.nativeElement).fullCalendar({
            displayEventTime: false,
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
                            color: '#00A65A'
                        }
                    });
                    callback(holidays.concat(leaves));
                });
            }
        });
    }
	fetchReviewStates(){
		this.http.get("/review/api/v1/dashboard?widgets=reviews-pie,question-categories,top-performers").subscribe((res)=>{
			var obj=res.json().data;
			this.reviewStates= obj;			 
		}) ;

	}
}
