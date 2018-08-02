import {Component, Output, Input, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {Http} from "@angular/http";
import {interpolate} from "../helpers";

declare var $:any;

const template = `
    <select #select class="form-control" style="width: 100%;" multiple>
        <ng-content></ng-content>
    </select>
`;

@Component({
    selector: 'multi-select2',
    template: template
})
export class MultiSelect2 {

    public cache = {};

    @ViewChild('select')
    public ref: ElementRef;

    @Input()
    public src:string;

    @Input()
    public field = 'name';

    @Input()
    public format:string;

    @Input()
    public params:any = {};

    @Input()
    public all:boolean = false;

    @Input()
    public placeholder = '';

    @Input()
    public allowClear:boolean = false;

    public _value = [];
    @Input()
    public set value(val){
        if(val && val !== this._value) {
            this.setInitialSelection((val));
        }
        this._value = val || [];
    };
    public get value(){ return this._value }

    @Output()
    public valueChange = new EventEmitter();

    public constructor(public http:Http){}

    ngAfterViewInit(){
        let opts:any = {
            // theme: 'bootstrap',
        };
        if(this.allowClear){
            opts.allowClear = true;
            opts.placeholder = this.placeholder
        }
        opts.ajax = {
            url: this.src,
            dataType: 'json',
            delay: 300,
            transport: this.transport.bind(this),
            processResults: this.processResults.bind(this),
            cache: true,
        };
        $(this.ref.nativeElement).select2(opts).on('select2:select', (e)=>{
            this._value.push(e.params.data.id);
            this.valueChange.emit(this._value);
        });
        $(this.ref.nativeElement).select2(opts).on('select2:unselect', (e)=>{
            let index = this._value.indexOf(e.params.data.id);
            this._value.splice(index, 1);
            this.valueChange.emit(this._value);
        });
    }
    setInitialSelection(value)
    {
        if(Array.isArray(value) && value.length > 0) {
            let params = {ids : value.join(',')};
            this.http.get(this.src, {search: params})
                .subscribe((res)=>{
                    let data = Object.values(res.json().data);
                    if(res.json().data.length === 0) return;
                    data.forEach((d)=>{
                        let result = this.processResult(d);
                        $(this.ref.nativeElement).append(`<option selected value="${result.id}">${result.text}</option>`)
                    });
                }, ()=>{

                });
        }
    }
    transport(params, success, failure){
        let key = JSON.stringify(params.data);
        if(this.cache.hasOwnProperty(key))
            return success(this.cache[key]);
        let data:any = {};
        if(params.data.q){
            data.q = params.data.q;
        }
        Object.assign(data, this.params);
        this.http.get(params.url, {search: data}).subscribe((res)=>{
            this.cache[key] = res.json();
            success(res.json());
        },()=>{
            failure();
        })
    }
    processResults(res){
        let data = Object.values(res.data);
        data =  data.map((d)=>{
            return this.processResult(d);
        });
        if(this.all){
            data.unshift({id: -1, text: 'All'})
        }
        return {results: data};
    }
    processResult(result){
        let text = result[this.field];
        if(this.format){
            text = interpolate(this.format, result);
        }
        return {id: result.id, text: text};
    }
}
