import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {Permission} from '../../auth/auth.module';
import {AuthService} from "../../auth/auth.service";
import {EmployeeStore} from "../EmployeeStore";
import {EmployeeListState} from "./EmployeeListState";
import {Designation} from "../../designation/Designation";
import {Department} from "../../department/Department";
import {ActivatedRoute} from "@angular/router";
import {Router, NavigationExtras} from "@angular/router";

import './EmployeeList.css';

@Component({
    selector: 'employees-list',
    templateUrl: './EmployeesList.html',
})
export class EmployeesList {

    @Input()
    public state:EmployeeListState;

    @Input()
    public designations: Designation[];

    @Input()
    public departments: Department[];

    public param:any=0;


    constructor(
        protected http: Http,
        protected auth:AuthService,
        public permission:Permission,
        protected route:ActivatedRoute,
        public store:EmployeeStore
    ){
        this.route.params.subscribe((params:any)=>{  this.param = params; })
    }
    ngOnInit(){
        this.store.fetchEmployees(1,this.param);
    }
    fetchDepDesignation(id){
       let url=`/core/api/v1/departments/${id}/designations`;
    }
    fetchEmployees(page, size){
 
    }
    getPicUrl(employee){
        let id = employee.image_id || 0;
        return `/core/api/v1/images/${id}`;
    }
    edit(e) {
        e.fetching = true;
    }
    pageChange(page){
    }

    empDetails(e){
        var status='';
        if(e.updated_by_name!='')
            status = 'By: ' + e.updated_by_name;
        return status;
    }
    empStatus(e){ 
      
     if(e.emp_status==2)
            {
                return 'inactive_employee';
            }
    }


    clock(e,t){
        var attendance =this.state.response.data.attendance;     
        var url ='/attendance/api/v1/clock/'+e.id+'/out';          
        if(t=='i')
            url ='/attendance/api/v1/clock/'+e.id+'/in';     
        
        this.http.get(url).retry(2)
        .subscribe((res) => {
            var re = res.json().data;        
           
            if(typeof attendance[e.id]=='object')    
                {
                    switch(t)
                        {
                            case 'i':
                                attendance[e.id]={employee_id:e.id, in:re.in_at ,out_at:null}
                            break;
                            case 'o':
                                attendance[e.id].employee_id = e.id;  
                                attendance[e.id].out_at = re.out_at; 
                            break;
                        }               
                }else
                   attendance[e.id]={employee_id:e.id, in:re.in_at,out_at:null}
        });       
    }

    clocked(att,id,type){

        obj={employee_id: 0, in:null,out_at:null};
        if( typeof att[id] == 'object')
                var obj = att[id] ;

        switch(type)
        {
            case 'i':
                if(obj.in == null && obj.out_at==null)
                    return true;                
                if(obj.out_at!=null && obj.in !=null)
                    return true;    
            break;
            case 'o':
                if(obj.in !=null && obj.out_at==null)
                     return true;
            break;
        }

        return false;
    }

    checkManager(e,d){
        var state = false;
        var current_emp_id = this.auth.data.employee.id ;
        if(current_emp_id == e.parent_id)
            state = true;
        if(this.auth.data.designation.name=='CEO' )
            state = true;
        if(e.id == current_emp_id)    
            state = true; 
        return state;
    }

    change_geo_fence(employee_id){
        this.http.post('/core/api/v1/employee/geo_fence/'+employee_id,{})
        .subscribe(
            (res) => {
            },
            (err) => {
                alert('There is an error. Please check console.');
                console.log(err);
            }
        );
    }

}
