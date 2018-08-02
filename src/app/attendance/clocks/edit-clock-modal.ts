import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Http} from "@angular/http";
import {clone} from "../../shared/helpers";
import * as moment from 'moment';
import {dateTimeFormat} from "../../shared/constants";
import {AuthService} from "../../auth/auth.service";

@Component({
    selector   : 'edit-clock-modal',
    templateUrl: './edit-clock-modal.html',
})
export class EditClockModal {

    public tz;

    @Output()
    public onHide = new EventEmitter();

    @Output()
    public onUpdate = new EventEmitter();

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

    constructor(protected http: Http, auth:AuthService){
        this.tz = auth.data.office.timezone;
    }
    save(){
        this.http.put(`/attendance/api/v1/clocks/${this.clock.id}`, this.clock).subscribe((res)=>{
            this.onUpdate.emit(res.json().data);
        }, (res)=>{
            this.errors = res.json().errors;
        });
    }
}
