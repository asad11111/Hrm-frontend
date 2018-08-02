import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Http} from "@angular/http";
import {ActivatedRoute} from "@angular/router";
import {clone} from "../shared/helpers";
import {ToastsManager} from "ng2-toastr";


@Component({
    selector: 'salary-slip-modal',
    templateUrl: './salary-slip-modal.html',
})
export class SalarySlipModal {

    public _salarySlip = null;

    public editingAmounts = [];

    public errors = {};

    @Input()
    public set salarySlip(val){
        if(val){
            this.errors = {};
            this.fetchSalaryAmounts(val.id);
        }
        this._salarySlip = val;
        console.log(val);
    }
    public get salarySlip(){
        return this._salarySlip;
    }
    @Output()
    public onHide = new EventEmitter();

    public _salaryAmounts = [];

    public salaryAmounts = [];

    @Input()
    public payroll:any = {};

    @Input()
    public employee:any = {};

    public saving = false;

    constructor(
        public http:Http,
        public route:ActivatedRoute,
        public toastr:ToastsManager
    ){}
    ngOnInit()
    {

    }
    fetchSalaryAmounts(salaryId)
    {
        this.http.get(`/nz-payroll/api/v1/salary_slips/${salaryId}/amounts`).subscribe((res)=>{
            let data =  res.json().data;
            this._salaryAmounts = clone(data);
            this.salaryAmounts = data;
        });
    }
    getTotalSalary(type)
    {
        return this.salaryAmounts
        .filter((a)=>{ return a.type === type })
        .map((a)=>{
            return a.amount;
        }).reduce((u, v)=>{
            v = parseInt(v);
            if(v) return parseInt(u) + v;
            return parseInt(u);
        }, 0);
    }
    getNetSalary()
    {
        return this.salaryAmounts
            .map((a)=>{
                return a.amount;
            }).reduce((u, v)=>{
                v = parseInt(v);
                if(v) return parseInt(u) + v;
                return parseInt(u);
        }, 0);
    }
    cancelEdit(salaryAmount)
    {
        this.editingAmounts.splice(this.editingAmounts.indexOf(salaryAmount), 1);
        if(salaryAmount.id){
            salaryAmount = this._salaryAmounts.find((s)=>{ return s.id === salaryAmount.id});
            let index = this.salaryAmounts.findIndex((s)=>{ return s.id === salaryAmount.id; });
            this.salaryAmounts[index] = clone(salaryAmount);
        }
        else {

        }
    }
    doneEdit(salaryAmount)
    {
        this.editingAmounts.splice(this.editingAmounts.indexOf(salaryAmount), 1);
        this.editingAmounts = this.editingAmounts.filter((s)=>{
            if(salaryAmount.id){
                return s.id !== salaryAmount.id;
            }
            return s !== salaryAmount;
        });
    }
    newAmount(type){
        let amount = {type: type};
        this.salaryAmounts.push(amount);
        this.editingAmounts.push(amount);
    }
    deleteAmount(amount)
    {
        let index = this.salaryAmounts.indexOf(amount);
        this.salaryAmounts.splice(index, 1);
    }
    save(){
        this.saving = true;
        let salaryId = this.salarySlip.id;
        let url = `/nz-payroll/api/v1/salary_slips/${salaryId}/amounts`;
        this.http.put(url, {amounts: this.salaryAmounts}).subscribe((res)=>{
            let employee = this.employee.first_name + ' ' + this.employee.last_name;
            this.toastr.success(`${employee} salary slip successfully updated`);
            this.saving = false;
            this.salaryAmounts = res.json().data;
            this.onHide.emit();
        }, (res)=>{
            if(res.status !== 422) return;
            this.errors = res.json().errors;
        });
    }


    toHours(v,d){ 
        
                var value:any=0;
                if(parseInt(v) > 0)
                switch(d)
                    {
                        case 'm':
                            value =  (v - (v % 60))  / 60; 
                            value = value + ':' + (v % 60);
                        break;
                    }
                
                return value; 
            }


    filterAmounts(type){
        return this.salaryAmounts.filter((s)=>{
            return s.type === type;
        });
    }
}
