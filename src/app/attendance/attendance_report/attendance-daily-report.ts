import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Http, URLSearchParams} from "@angular/http";
import * as moment from 'moment';
import {TableToCsv} from "../../shared/services/table-to-csv";
import {ActivatedRoute} from "@angular/router";
import {Subject} from "rxjs/Subject";
import {RequestStatus} from "../../shared/services/Http";


@Component({
    selector   : 'attendance-daily-report',
    templateUrl: './attendance-daily-report.html',
})
export class AttendanceDailyReport {

    @ViewChild('table')
    public tableRef:ElementRef;

    @Input()
    public data:any = {employees: { data: [], page_size: 15}, reports: {}};

    @Input()
    public fetching:RequestStatus;

    @Output()
    public onFetch = new EventEmitter();

    public date = moment().format('YYYY-MM-DD');

    public onSearch = new Subject();

    public search = '';

    public constructor(public http:Http, public tableToCsv:TableToCsv, public route:ActivatedRoute){
    }
    ngOnInit(){
        this.onSearch
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe((value:string)=>{
                this.search = value || '';
                this.fetch();
            });
        this.route.queryParams.subscribe((params:any)=>{
            if(params.date){
                this.date = params.date;
            }
        });
    }
    fetch(page=1)
    {
        this.onFetch.emit({
            date: this.date,
            page: page,
            size: '25',
            q: this.search
        });
    }
    toCsv(){
        let filename = 'attendance-daily-report.csv';
        this.tableToCsv.make(this.tableRef.nativeElement, filename);
    }
    getLabel(report){
        if(report.present)  return 'label-primary';
        else if (report.absent) return 'label-danger';
        else if (report.leave) return 'label-success';
        else if (report.holiday) return 'label-warning';
        return 'label-info'
    }
    getStatus(report){
        if(report.present)  return 'Present';
        else if (report.absent) return 'Absent';
        else if (report.leave) return 'Leave';
        else if (report.holiday) return 'Holiday';
        return 'Overtime'
    }

    overTime(r){
        
       if(typeof r.shift_duration=='undefined' )
            return "";
       var total_working_hours = r.worked_minutes  - r.shift_duration;
        //console.log(typeof r.shift_duration,total_working_hours);
        return (total_working_hours > 0)?this.toHours(total_working_hours,'m'):0 ;
    }

    empStatus(e){ 
        if(e.emp_status==2)
            return 'inactive_employee';
        return '';
    }


    toHours(v,d){   
                var value:any=0;
                if(parseInt(v) > 0)
                switch(d)
                    {
                        case 'm':
                            value =  (v - (v % 60))  / 60;  
                            value = value + ':' + (v % 60);
                        break;
                    }
                
    return value; }

}
