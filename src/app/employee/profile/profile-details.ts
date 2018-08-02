import {Component, OnInit, Input} from '@angular/core';
import './profile-details.css';
import {Http} from "@angular/http";
import * as moment from 'moment';
import {AuthService} from '../../auth/auth.service';


@Component({
    selector: 'profile-details',
    templateUrl: './profile-details.html'
})
export class ProfileDetails implements OnInit {

    public date: string;
    public employee_id;
    public employeeInfo:any={};
    public attendance:any={};
    public employee:any={};

    @Input()
    public data:any = {employee:{logged_today:0}};

    public editEmployeeId = null;

    constructor( protected http: Http,
        public auth:AuthService
        ) {
            
            
     
        
    }
    ngOnInit(){
        this.date = moment().format('YYYY-MM-DD');
        this.employee = this.auth.getUser().employee;
        this.employee_id =this.employee.id; 
        this.clockInfo();
        
    }
    onUpdate=(e)=>{
        this.editEmployeeId=null;
        this.data.employee = e.employee;         
    }

    editEmployee=(e)=>{
        this.editEmployeeId = e.id;         
    }

    addressdata=(d)=>{
       // console.log(d.employee);
    }


    clockInfo()
    {
        this.http.get('/core/api/v1/employees').subscribe((res)=>{
            this.employeeInfo = res.json().data;
            this.attendance=this.employeeInfo.attendance;
            console.log(this.employeeInfo);
            return this.employeeInfo;
        });

    }
    

    checkManager(emp_i){ 
        var state = false;
        var current_emp_id = this.auth.data.employee.id ;
        if(current_emp_id == this.employeeInfo.parent_id)
            state = true;
        if(this.auth.data.designation.name=='CEO' )
            state = true;
        if(this.employeeInfo.id == current_emp_id)    
            state = true; 
        return state;
    }

    

    clock(e,t){
        var attendance =this.attendance;     
        var url ='/attendance/api/v1/clock/'+e.id+'/out';          
        if(t=='i')
            url ='/attendance/api/v1/clock/'+e.id+'/in';     
        
        this.http.get(url).retry(2)
        .subscribe((res) => {
            var re = res.json().data;           
        });       
    }
    
}
