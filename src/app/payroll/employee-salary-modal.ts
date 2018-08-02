import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Http} from "@angular/http";
import {AuthService} from "../auth/auth.service";
import {clone} from "../shared/helpers";


@Component({
    selector   : 'employee-salary-modal',
    templateUrl: './employee-salary-modal.html',
})
export class EmployeeSalaryModal {

    @Output()
    public onHide = new EventEmitter();

    @Output()
    public onCreate = new EventEmitter();

    @Output()
    public onUpdate = new EventEmitter();

    public saving = false;

    public errors = {};

    @Input()
    public employee;

    public _salary;

    @Input()
    public set salary(val){
        this._salary = clone(val);
        this.errors = {};
    }
    public get salary(){
        return this._salary;
    }
    public constructor(public http:Http) {

    }
    ngOnInit() {

    }
    save(s) {
        this.salary.id ? this.update(s) : this.create(s);
    }
    create(salary){
        this.saving = true;
        this.http.post('/payroll/api/v1/employee_salaries', salary).subscribe((res)=>{
            this.onCreate.emit(res.json().data);
            this.saving = false;
        }, (res)=>{
            if(res.status !== 422) return;
            this.errors = res.json().errors;
            this.saving = false;
        })
    }
    update(salary){
        let id = salary.id;
        this.saving = true;
        this.http.put(`/payroll/api/v1/employee_salaries/${id}`, this.salary).subscribe((res)=>{
            this.onUpdate.emit(res.json().data);
            this.saving = false;
        }, (res)=>{
            if(res.status !== 422) return;
            this.errors = res.json().errors;
            this.saving = false;
        })
    }

}

