import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import * as moment from 'moment';

declare var $:any;

@Component({
    selector: 'datetime-picker',
    template: `<input type="text" class="form-control"/>`,
})
export class DateTimePicker {

    _value: string = '';

    @Input()
    public set value(val){
        if(val){
            this._value = val;
            let el = this.getEl();
            let instance = $(el).data('DateTimePicker');
            if(instance) {instance.date(val)}
        }
        this._value = val;
    }
    public get value(){
        return this._value;
    }

    @Input()
    format: string = 'YYYY-MM-DD';

    @Input()
    endDate: any;

    @Input()
    startDate: any;

    @Output()
    valueChange = new EventEmitter();

    @Input()
    startView: any;

    @Input()
    minViewMode: any;

    constructor(protected el: ElementRef) {

    }
    ngAfterViewInit() {
        let el = this.getEl();
        $(el).datetimepicker({
        }).on('dp.change', (e)=>{
            if(e.date){
                this._value = e.date;
            }
            else {
                this._value = null
            }
            this.valueChange.emit(this._value);
        });
        let instance = $(el).data('DateTimePicker');
        instance.date(this._value || null)
    }
    getEl() {
        return this.el.nativeElement.firstChild;
    }
}
