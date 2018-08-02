import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Http} from "@angular/http";
import {AuthService} from "../auth/auth.service";
import {clone} from "../shared/helpers";

@Component({
    selector   : 'create-payroll',
    templateUrl: './create-payroll.html',
})
export class CreatePayroll {

    @Output()
    public onHide = new EventEmitter();

    @Output()
    public onUpdate = new EventEmitter();

    @Output()
    public onCreate = new EventEmitter();

    public _payroll;
    public title;
    public start_date:string;
    public end_date:string;
    public months:any;
    public month: number;
    public years:any;
    public year: number;
    public processing:boolean =false;

    @Input()
    public set payroll(val){
        this._payroll = clone(val);
        this.errors = {};
        if(val){ this.fetchEmployees() }
    }
    public get payroll(){
        return this._payroll;
    }

    public errors:any = {};
    public employees = [];
    public employeeIds = [];

    constructor(protected http: Http, protected auth:AuthService)
    {
        this.months = [
            'January', 'February', 'March',
            'April', 'May', 'June', 'July',
            'August', 'September', 'October',
            'November','December'
        ];
        this.month = (new Date()).getMonth() + 1;
        let year = (new Date()).getFullYear();
        this.years = [0,1,2,3,4,5,6,7,8,9].map((i)=>{
            return year - i;
        });
        this.year = year;
        this.processing=false;
    }
    ngOnInit()
    {

    }
    fetchEmployees()
    {
        this.http.get('/payroll/api/v1/salaried_employees').subscribe((res)=>{
            this.employees = res.json().data;
        });
    }
    toggleAllEmployees(e)
    {
        let val = e.target.checked;
        if(val === false){
            this.employeeIds = [];
        } else {
            this.employeeIds = Object.values(this.employees).map((e)=>{
                return e.id;
            });
        }
    }
    toggleEmployee(checked, employeeId)
    {
        if(checked){
            this.employeeIds.push(employeeId);
        } else {
            this.employeeIds = this.employeeIds.filter((e)=>{
                return e.id !== employeeId;
            });
        }
    }
    save(){
        let payload = {
            title: this.title,
            start_date: this.start_date,
            end_date: this.end_date,
            employeeIds: this.employeeIds
        };
        if(this.processing==false){
            this.processing=true;
            this.http.post('/payroll/api/v1/payrolls', payload).subscribe((res)=>{
                this.onCreate.emit(res.json().data);
                this.processing=false;
            }, (res)=>{
                this.processing=false;
                if(res.status !== 422) return;
                this.errors = res.json().errors;
            });
        }
    }
}