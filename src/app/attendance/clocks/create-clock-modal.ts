import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Http} from "@angular/http";
import {clone} from "../../shared/helpers";
import * as moment from 'moment';
import {dateTimeFormat} from "../../shared/constants";
import {AuthService} from "../../auth/auth.service";
import {Permission} from '../../auth/permission.service';

@Component({
    selector   : 'create-clock-modal',
    templateUrl: './create-clock-modal.html',
})
export class CreateClockModal {

    public tz;

    @Output()
    public onHide = new EventEmitter();

    @Output()
    public onCreate = new EventEmitter();

    public _employees = [];

    public employee:any ={};

    @Input()
    public set employees(val){
        if(val){
            val = Object.values(val).slice(1, val.length)
        }
        this._employees = val;
    }
    public get employees(){
        return this._employees;
    }
    public _clock;

    @Input()
    public set clock(val){
        this.errors = {};
        if(val){
            this._clock = Object.assign({}, val, {
                in_at:  moment.utc(val.in_at).tz(this.tz),
                out_at:  moment.utc(val.out_at).tz(this.tz),
            });
            return;
        }
        this._clock = val;
    }
    public get clock(){
        return this._clock;
    }
    public errors:any = {};

    constructor(protected http: Http, auth:AuthService,public permission:Permission){
        this.tz = auth.data.office.timezone;
        this.employee = auth.getUser().employee;
    }
    save(){
 
        this.http.post(`/attendance/api/v1/clocks`, this.clock).subscribe((res)=>{
            this.onCreate.emit(res.json().data);
        }, (res)=>{
            this.errors = res.json().errors;
        });
    }
}
