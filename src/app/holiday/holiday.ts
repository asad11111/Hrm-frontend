import {Component, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {clone} from '../shared/helpers';
import {Confirm} from "../shared/components/confirm";
import {ToastsManager} from "ng2-toastr";

@Component({
    selector   : 'holiday',
    templateUrl: './holiday.html',
})
export class Holiday {

    public holiday:any = {
        title: '',
    };

    @ViewChild('confirm')
    confirm:Confirm;

    public saving = false;

    public holidays = [];

    public errors = {};

    constructor(
        protected http:Http,
        protected toastr:ToastsManager
    ){}
    ngOnInit(){
        this.http.get('/attendance/api/v1/holidays').subscribe((res)=>{
            this.holidays = res.json().data;
        });
    }
    edit(holiday){
        this.errors = {};
        this.holiday = clone(holiday);
    }
    cancelEdit(){
        this.errors = {};
        this.holiday  = {};
    }
    add(){
        this.saving = true;
        this.http.post('/attendance/api/v1/holidays', this.holiday).subscribe((res)=>{
            var data = res.json().data;
            this.errors = {};
            this.holiday = {};
            this.holidays.unshift(data);
            this.toastr.success(`Successfully ${data.title} created`, 'Holiday');
        }, (res)=>{
            this.errors = res.json().errors;
            this.saving = false;
        }, ()=>{
            this.saving = false;
        });
    }
    save() {
        this.saving = true;
        this.http.put(`/attendance/api/v1/holidays/${this.holiday.id}`, this.holiday).subscribe((res)=> {
            this.errors = {};
            this.holiday = {};
            var holiday = res.json().data;
            var index = this.holidays.findIndex((h)=>{
                return h.id === holiday.id
            });
            this.holidays[index] = holiday;
            this.toastr.success(`Successfully ${holiday.title} updated`, 'Holiday');
            this.saving = false;
        }, (res)=>{
            this.errors = res.json().errors;
            this.saving = false;
        },()=>{
        });
    }
    destroy(holiday){
        this.confirm.show(`Are you sure you want to delete '${holiday.title}'`).then((opt)=> {
            if (opt === false) return;
            this.http.delete(`/attendance/api/v1/holidays/${holiday.id}`).subscribe((res)=> {
                this.toastr.success(`Successfully ${holiday.title} deleted `, 'Holiday');
                var index = this.holidays.findIndex((h)=>{
                    return h.id == holiday.id;
                });
                this.holidays.splice(index, 1);
            });
        });

    }
}
