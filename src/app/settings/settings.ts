import {Component} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Permission} from "../auth/permission.service";

@Component({
    selector: 'settings',
    templateUrl: './settings.html',
})
export class Settings {

    public employee:any;

    constructor(public auth:AuthService, public permission:Permission){
        this.employee = this.auth.data.employee;
    }

    is_manager(){
        if(parseInt(this.auth.data.manager) > 0 )
            return true;
        return false;
    }
}