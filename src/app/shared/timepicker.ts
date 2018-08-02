import {Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import * as moment from 'moment';
declare var $:any;

@Component({
    selector   : 'timepicker',
    template: `<input type="text" class="form-control"/>`,
})
export class Timepicker {

    _value:string;

    @Input()
    public showMeridian = true;

    @Input()
    public set value(val){
        this._value = val;
        $(this.el.nativeElement.firstChild).timepicker('setTime', this.toAmPm(val));
    }
    public get value(){
        return this._value;
    }
    @Output() valueChange = new EventEmitter();
    constructor(protected el:ElementRef){

    }
    ngAfterViewInit() {
        $(this.el.nativeElement.firstChild).timepicker({
            showMeridian: this.showMeridian,
            defaultTime: this.toAmPm(this._value),
            showInputs: false
        }).on('changeTime.timepicker',(e)=>{
            let time = e.time.value;
            time = this.to24(time);
            this._value = time;
            this.valueChange.emit(time);
        });
    }	
    toAmPm(time){
        if(time){
            return moment(time, 'HH:mm').format('hh:mm a')
        }
        return time;
    }
    to24(time){
        if(time) {
            return moment(time, ["h:mm A"]).format('HH:mm');
        }
        return time;
    }
}
