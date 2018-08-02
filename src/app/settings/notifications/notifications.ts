import {Component, Input,ViewChild} from '@angular/core';
import { Http } from "@angular/http"; 
import {ToastsManager } from "ng2-toastr";
import {Router, ActivatedRoute} from  "@angular/router";
import {Confirm} from "../../shared/components/confirm";
import {Alert} from "../../shared/components/alert";
import {AuthService} from "../../auth/auth.service";
import {Permission} from "../../auth/permission.service";

@Component({
    selector: 'notifications',
    templateUrl: './notifications.html',
})
export class Notifications {

    @ViewChild('confirmreviewer') public confirm: Confirm;    
    public processing: any = false;
    public notify:any={ mobile_attendance:false, daily_report:false };
    public errors = {};
    constructor(public auth:AuthService, protected http: Http,protected toastr: ToastsManager) {  }
    ngOnInit(){ 
        this.getNotificationSettings();                  
    }

    getNotificationSettings(){

        this.http.get(`/attendance/api/v1/notification/${ this.auth.data.employee.id }`)
        .subscribe((re)=>{  
            var notify = re.json().data ;           
            if(notify != null)
              this.notify = re.json().data ; 

        },(re)=>{       });

    }
 
    saveNotification=()=>{
        this.processing = true;      
        this.http.post(`/attendance/api/v1/notification/${ this.auth.data.employee.id }/update`,this.notify)
        .subscribe((re)=>{
            this.processing = false; 
            this.toastr.success('Settings saved successfully.')
        },(re)=>{
            this.processing = false; 
        }); 
    } 
}