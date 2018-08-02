import {Component} from '@angular/core';
import {Permission} from '../auth/permission.service';
import {AuthService} from '../auth/auth.service';
let logoSrc = require('../../assets/logo/128x128.png');

@Component({
    selector   : 'side-nav',
    templateUrl: './sidenav.html',
})
export class SideNav {
    public superAdmin:any=false;
    
    constructor(
        public permission:Permission,
        public auth:AuthService,
    ){
       
    }
    ngOnInit(){
        
        this.auth.data.user.is_super_admin;
    }
    ngAfterViewInit(){
        $('#side-menu').metisMenu();
    }
    getEmployeePicPath(){
        let id = this.auth.data.employee.image_id || 0;
        return `/core/api/v1/images/${id}`;
    }
    logout($event){
        $event.preventDefault();
        this.auth.logout();
    }
    getLogoUrl(){
        let id = this.auth.data.office.logo_id;
        if(id){
            return `/core/api/v1/images/${id}`;
        }
        return logoSrc;
    }

    allow(type){
        var allow = false;
        switch(type)
            {
                case 'attendance':
                if(this.permission.can('Attendance.view_attendance') || 
                    this.permission.can('Attendance.manage_attendance') || 
                    this.permission.can('Attendance.view_attendance_own') || 
                    this.permission.can('Attendance.manage_attendance_own') 
                )
                allow = true;

                break;

            }
 
        return allow;

    }
}
