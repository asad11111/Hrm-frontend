import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import * as moment from 'moment';

declare var $: any;

@Component({
    selector: 'datepicker',
    template: `<input type="text" [ngClass]="['form-control', 'input-'+size ]"/>`,
})
export class Datepicker {

    _value: string;

    _disabled = false;

    @Input()
    public size = 'md';

    @Input()
    public set disabled(value) {
        this._disabled = value;
        $(this.getEl()).datepicker('option', 'disabled', this._disabled);

    }
    public get disabled() {
        return this._disabled;
    }

    @Input()
    public set value(val){
        if(val){
            this._value = val;
            let date = moment(val).format('MM/DD/YYYY');
            let el = this.getEl();
            $(el).datepicker('update', date);
        }
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
        $(el).datepicker({
            autoclose: true,
            endDate: this.endDate,
            startDate: this._value || ''
        }).on('changeDate', (e)=>{
            let date = e.date;
            this._value = date;
            this.valueChange.emit(moment(date).format('YYYY-MM-DD'));
        });

        // if(this.minViewMode=='months')
        // {
        //
        //
        //     $(el).datepicker({
        //                         format: 'mm/yyyy',
        //                         viewMode: "months",
        //                         minViewMode: "months",
        //                         endDate: this.endDate,
        //                         startDate: this.startDate,
        //                         autoClose: true
        //     }).on('changeDate', (e)=>{
        //             var date = moment(e.date).format("YYYY-MM-DD");
        //             this._value = date;
        //             this.valueChange.emit(date);
        //         });
        //
        // }else{




        // }
 
    }
    ngOnChanges(c) {
            // $(el).datepicker({
            //     format: 'mm/yyyy',
            //     viewMode: "months",
            //     minViewMode: "months",
            //     endDate: this.endDate,
            //     startDate: date,
            //     autoClose: true
            // });
    }
    getEl() {
        return this.el.nativeElement.firstChild;
    }
}
