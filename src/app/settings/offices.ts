import {Component, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
declare var google:any;


@Component({
    selector: 'settings-offices',
    templateUrl: './offices.html',
})
export class SettingsOffices {

    @ViewChild('officeMap')
    public officeMap;

    public offices = [];

    public timezones = [];

    constructor(protected http:Http) {
    }
    ngOnInit() {
        this.http.get('/core/api/v1/tz/list').subscribe((res)=>{
            this.timezones = res.json().data;
        });
        this.http.get('/core/api/v1/offices').subscribe((res)=>{
            this.offices = res.json().data;
        })
    }
    save(office) {
        let adr = <HTMLInputElement>document.getElementById("ofc_adr_string");
        office.saving = true;
        office.address = adr.value;
        this.http.put(`/core/api/v1/offices/${office.id}`, office).subscribe((res)=>{
            office.saving = false;
        });
    }
    loadMap(el){

    }
}