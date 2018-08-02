import {Component, Input, ViewChild} from '@angular/core';
import {Http,URLSearchParams} from "@angular/http";
import * as moment from 'moment';
import {ActivatedRoute} from "@angular/router";
import {ToastsManager} from "ng2-toastr";
import {Confirm} from "../../shared/components/confirm";
import {Permission} from '../../auth/permission.service';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector   : 'clocks',
    templateUrl: './clocks.html',
})
export class Clocks {

    @ViewChild('confirm')
    public confirm:Confirm;

    public createClock;

    public clock;

    public clocks:any = {
        data: []
    };

    public employees:any = {};

    public date: string;

    public employee_id;

    public employee:any={};

    public fetched = false;

    public fetching = false;

    constructor(
        protected http: Http,
        protected route: ActivatedRoute,
        protected toastr:ToastsManager,
        public permission:Permission,
        public auth:AuthService,
    ) {}
    ngOnInit() {
        this.date = moment().format('YYYY-MM-DD');
        this.employee = this.auth.getUser().employee;
        this.employee_id =this.employee.id; 
    }
    fetch(page=1) {
        this.fetching = true;
        let params = {
            employee_id: this.employee_id,
            date: this.date,
            page: page
        };
        this.http.get(`/attendance/api/v1/clocks`, {search: params})
        .subscribe((res) => {
            let data = res.json().data;
            this.clocks = data.clocks;
            this.employees = data.employees;
            this.fetching = false;
            this.fetched = true;
        });
    }
    onCreate(clock){
        if(clock.employee_id == this.employee_id || this.employee_id == null){
            this.clocks.data.unshift(clock);
        }
        this.createClock = null;
    }
    onUpdate(clock){
        this.clock = null;
        let index = this.clocks.data.findIndex((c)=>{
            return c.id === clock.id;
        });
        this.clocks[index] = clock;
        this.toastr.success('Clock as been updated');
    }
    destroy(clock){
        this.confirm.show('Are you sure you want to delete this record ?').then((opt)=>{
            if(opt === false) return;
            this.http.delete(`/attendance/api/v1/clocks/${clock.id}`).subscribe(()=>{
                this.toastr.success('Record has been successfully deleted');
                this.clocks.data = this.clocks.data.filter((c)=>{
                    return c.id != clock.id;
                })
            });
        })
    }
}