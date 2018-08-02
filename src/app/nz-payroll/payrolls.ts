import {Component, Input, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr";
import {Fetch, FetchedArrayResult} from "../shared/Fetch";
import {Payroll} from "./Payroll";
import {Confirm} from "../shared/components/confirm";


@Component({
    selector: 'payrolls',
    templateUrl: './payrolls.html',
})
export class Payrolls {

    @ViewChild('confirm')
    public confirm:Confirm;

    public payroll = null;

    public payrolls = new FetchedArrayResult<Payroll>();


    constructor(
        public http:Http,
        public toastr:ToastsManager,
        public fetch:Fetch
    ) {

    }
    ngOnInit()
    {
        this.fetchData();
    }
    fetchData()
    {
        this.fetch.all<Payroll>('/nz-payroll/api/v1/payrolls')
        .subscribe((result)=>{
            this.payrolls = result;
        });
    }
    onCreate(payroll)
    {
        this.toastr.success('Payroll has been successfully created');
        this.payroll = null;

        this.payrolls.data.unshift(payroll);
    }
    destroy(p){
        this.confirm.show(`Are you sure you want to delete ${p.title} payroll?`).then((opt)=>{
            if(opt === false) return;
            this.http.delete(`/nz-payroll/api/v1/payrolls/${p.id}`).subscribe((res)=>{
                this.payrolls.data = this.payrolls.data.filter((payroll)=>{
                    return payroll.id !== p.id;
                });
            });
        })
    }

}
