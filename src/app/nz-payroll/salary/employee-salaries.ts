import {Component, ElementRef, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {clone} from "../../shared/helpers";
import {Fetch, PaginatedResult} from "../../shared/Fetch";
import {Salary} from "./Salary";
import {ToastsManager} from "ng2-toastr";
import {AuthService} from "../../auth/auth.service";
import {Employee} from "../../employee/Employee";
import {Confirm} from "../../shared/components/confirm";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounceTime';
import './EmployeeSalaries.css';

@Component({
    selector   : 'employee-salaries',
    templateUrl: './employee-salaries.html',
})
export class EmployeeSalaries {

    public filter = {
        show: 'all',
        search: ''
    };

    public showImportModal = false;

    @ViewChild('confirm')
    public confirm:Confirm;

    @ViewChild('search')
    public search:ElementRef;

    public employee_id;

    public res = new PaginatedResult<Response>();

    public salary:Salary;

    constructor(
        public http:Http,
        public fetch:Fetch,
        public toastr:ToastsManager,
        public auth:AuthService
    ) {
    }
    ngOnInit()
    {
        this.fetchData(1);
        Observable.fromEvent(this.search.nativeElement, 'keyup')
        .debounceTime(300)
        .subscribe((e)=>{
            this.fetchData(1);
        })
        ;
    }
    public editSalary(salary)
    {
        this.salary = clone(salary);
    }
    newSalary(employee_id){
        let salary = new Salary();
        salary.employee_id = employee_id;
        this.salary = salary;
    }
    onCreate = (s:Salary)=>{
        let salaries = this.res.data.salaries[s.employee_id] || [];
        salaries.push(s);
        this.res.data.salaries[s.employee_id] = salaries;
        this.salary = null;
        this.toastr.success('Salary successfully created');
    };
    onUpdate(s:Salary){
        let salaries = this.res.data.salaries[s.employee_id] || [];
        let index = salaries.findIndex((salary) => salary.id === s.id);
        salaries[index] = s;
        this.salary = null;
        this.toastr.success('Salary successfully updated');
    }
    destroy(salary:Salary){
        this.confirm.show('Are you want to delete this record?').then((opt)=>{
            if(opt === false) return;
            this.http.delete(`/nz-payroll/api/v1/employee_salaries/${salary.id}`)
                .subscribe(()=>{
                    let salaries =  this.res.data.salaries[salary.employee_id];
                    salaries = salaries.filter((s)=> s.id !== salary.id);
                    this.res.data.salaries[salary.employee_id] = salaries;
                    this.toastr.success('Salary successfully deleted');
                });
        });
    }
    public onSave(s){
        // this.salaries[s.employee_id] = s;
        // this.salary = null;
    }
    public onBulkImport(){
        this.showImportModal = false;
        this.fetchData(1);
    }
    public fetchData(page)
    {
        this.fetch.paginate<Response>(`/nz-payroll/api/v1/employee_salaries`, page, this.filter)
        .subscribe((res)=> {
            this.res = res;
        });
    }
    getNetSalary(salaries=[])
    {
        return salaries
        .map((s)=>{
            return s.salary;
        }).reduce((u, v)=>{
            v = parseInt(v);
            if(v) return parseInt(u) + v;
            return parseInt(u);
        }, 0);
    }
}

interface Response {
    employees: Array<Employee>,
    salaries: {[key: number]: Array<Salary>}
}
