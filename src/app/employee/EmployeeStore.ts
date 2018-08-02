import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Designation} from "../designation/Designation";
import {Department} from "../department/Department";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {EmployeeListState, EmployeesResponse} from "./EmployeesList/EmployeeListState";
import {EmployeeViewState} from "./EmployeesViewState";
import {clone, toFormData, update} from "../shared/helpers";
import {Fetch, FetchedArrayResult} from "../shared/Fetch";
import {Employee, Role, User} from './Employee';
import {ToastsManager} from "ng2-toastr";
import {AuthService} from "../auth/auth.service";
import {Permission} from "../auth/permission.service";

@Injectable()
export class EmployeeStore {

    public state$:BehaviorSubject<EmployeeViewState>;

    public constructor(
        public http:Http, 
        public fetch:Fetch, 
        public toastr:ToastsManager,
        public auth:AuthService, public permission:Permission
    ){
        let state = new EmployeeViewState();
        this.state$ = new BehaviorSubject(state);
    }
    fetchEmployees(page,arg){
        let params = this.state$.getValue().employeesList.filters;

        if(typeof arg.type=='string')
        {
            params[arg.type]=arg.id;
        }

        //console.log(typeof arg.type);

        this.fetch.paginate<EmployeesResponse>('/core/api/v1/employees', page, params)
        .subscribe((result)=>{
            let state = this.state$.getValue();

            state = update(state, {
                employeesList: {
                    response: {$set: result}
                }
            });
            this.state$.next(state);
        });
    }
    showFilterPopover(){
        let state = this.state$.getValue();
        let show = state.employeesList.showPopover;
        state = update(this.state$.getValue(), {employeesList:{ showPopover: {$set: !show}}});
        this.state$.next(state);
    }
    fetchDesignations()
    {
        let state = this.state$.getValue();
        if(state.designations.fetching || state.designations.fetched) return;
        this.fetch.all<Designation>('/core/api/v1/designations/list')
        .subscribe((result)=>{
            state = update(this.state$.getValue(), {designations:{ $set: result }});
            this.state$.next(state);
        });
    }
    fetchDepartments(){
        let state = this.state$.getValue();
        if(state.departments.fetching || state.departments.fetched) return;
        this.fetch.all<Department>('/core/api/v1/departments/list').subscribe((result) => {
            state = update(this.state$.getValue(), {departments:{$set: result}});
            this.state$.next(state);
        });

    }

    fetchEmployeesList()
    {
        let state =  this.state$.getValue();
        this.fetch.all<Employee>('/core/api/v1/employees/list')
        .subscribe((res)=>{
            state = update(this.state$.getValue(), {employees: {$set: res}});
            this.state$.next(state);
        });
    }
    fetchRolesList(){
        let state =  this.state$.getValue();
        if(state.roles.fetched || state.roles.fetching) return;
        this.fetch.all<Role>('/core/api/v1/roles/list')
        .subscribe((res)=>{
            state =  update(this.state$.getValue(), {roles: {$set: res}});
            this.state$.next(state);
        });
    }
    newEmployee(){
        let state = this.state$.getValue();
        state = update(state, {
            createEmployee:{
                show: {$set: true}
            }
        });
        this.state$.next(state);
    }
    createEmployee()
    {
        let state = this.state$.getValue();
        let payload = Object.assign({}, state.createEmployee.employee, state.createEmployee.user);
        payload =  toFormData(payload);
        this.http.post('/core/api/v1/employees', payload).subscribe((res)=>{
            let data = res.json().data;
            let employee:Employee = data.employee;
            let user:User = data.user;
            let state = this.state$.getValue();
            let employees = [employee].concat(state.employeesList.response.data.employees);

            state = update(state, {
                createEmployee:{
                    show: {$set: false},
                    employee: {$set: new Employee()},
                    user: {$set: new User()}
                },
                employeesList: {
                    response: { data: {
                        employees: {$set: employees},
                        users: {[user.id]: {$set: user}}
                    }}
                }
            });
            if(this.auth.hasModule('NZ-Payroll') && this.permission.can('NZ-Payroll.manage_nz_payroll_employee_configurations')){
                let payroll_additional_keys = {
                    "office_id": employee.office_id,
                    "employee_id": employee.id,
                    "remaining_moj" : state.createEmployee.payroll.ministry_of_fine
                }
                this.http.post('/nz-payroll/api/v1/employee_configrations', Object.assign(state.createEmployee.payroll, payroll_additional_keys))
                .subscribe(
                    (res) => {
                        this.toastr.success(`Employee ${employee.first_name} ${employee.last_name} successfully created`);
                        this.state$.next(state);
                    },
                    (err) => {
                        this.toastr.success(`Employee ${employee.first_name} ${employee.last_name} successfully created but Payroll settings not saved.`);
                        this.state$.next(state);
                    }
                );
            } else {
                this.toastr.success(`Employee ${employee.first_name} ${employee.last_name} successfully created`);
                this.state$.next(state);
            }
        }, (res)=>{
            let state = this.state$.getValue();
            state = update(state, { createEmployee:{ errors: { $set: res.json().errors } } });
            this.state$.next(state);
        });
    }
    editEmployee(employee:Employee, user:User){
        let state = this.state$.getValue();
        if(!employee.address)
            employee.address ={};
        
        if(this.auth.hasModule('NZ-Payroll')){
            this.http.get('nz-payroll/api/v1/employee_configrations/'+employee.id)
            .subscribe(
                (res)=>{
                    let r = res.json().data;
                    if(r.pay_rate_type == 'Hourly') r.pay_rate_type = 'hour';
                    if(r.pay_rate_type == 'Daily') r.pay_rate_type = 'day';
                    if(r.pay_rate_type == 'Weekly') r.pay_rate_type = 'week';
                    if(r.pay_rate_type == 'Fortnightly') r.pay_rate_type = '2 weeks';
                    if(r.pay_rate_type == 'Monthly') r.pay_rate_type = 'month';
                    state = update(state,{
                        editEmployee: {
                            employee: {$set: clone(employee)},
                            user: {$set: clone(user)},
                            payroll: {$set: clone(r)},
                            show: {$set: true}
                        }
                    });
                    this.state$.next(state);
                },
                (res)=>{
                    let r = res.json().data;
                    state = update(state,{
                        editEmployee: {
                            employee: {$set: clone(employee)},
                            user: {$set: clone(user)},
                            payroll: {$set: clone({})},
                            show: {$set: true}
                        }
                    });
                    this.state$.next(state);
                }
            );
        } else {
            state = update(state,{
                editEmployee: {
                    employee: {$set: clone(employee)},
                    user: {$set: clone(user)},
                    show: {$set: true}
                }
            });
            this.state$.next(state);
        }
    }
    setDeleteEmployee(employee){
        let state = this.state$.getValue();
        state = update(state,{
            employeesList: {
                deleteEmployee: {$set: employee},
            }
        });
        this.state$.next(state);
    }
    deleteEmployee(opt){
        let state = this.state$.getValue();
        if(opt === false){
            state  = update(state, {
                employeesList: {
                    deleteEmployee: {$set: null},
                }
            });
            return this.state$.next(state);
        }
        let id = state.employeesList.deleteEmployee.id;
        this.http.delete('/core/api/v1/employees/'+id).subscribe(()=>{
            state = this.state$.getValue();
            let employees = state.employeesList.response.data.employees.filter((e)=> e.id != id);
            state  = update(state, {
                employeesList: {
                    deleteEmployee: {$set: null},
                    response: {data: {employees:{$set: employees}}}
                }
            });
            this.state$.next(state);
            this.toastr.success('Employee successfully deleted');
        });
    }
    updateEmployee()
    {
        
        let state = this.state$.getValue();
        let payload = Object.assign({}, state.editEmployee.employee, state.editEmployee.user);
        payload =  toFormData(payload);

        //console.log(state.editEmployee.employee);
        let url = `/core/api/v1/employees/${state.editEmployee.employee.id}/update`;
        this.http.post(url, payload).subscribe((res)=>{
            let data = res.json().data;
            let employee = data.employee;
            let user = data.user;
            let employees = state.employeesList.response.data.employees;
            let index = employees.findIndex((e)=>{return e.id === employee.id});
            employees = employees.slice(0, index).concat(employee, employees.slice(index + 1));
            state = update(state, {
                employeesList: {
                    response: {
                        data: {
                            employees: {$set: employees},
                            users: {[user.id]: {$set: user}}
                        }
                    }
                },
                editEmployee: {
                    employee: {$set: null},
                    show: {$set: false},
                    imgSrc:{$set: null}
                }
            });
            if(this.auth.hasModule('NZ-Payroll') && this.permission.can('NZ-Payroll.manage_nz_payroll_employee_configurations')){
                let payroll_additional_keys = {
                    "office_id": employee.office_id,
                    "employee_id": employee.id
                };
                this.http.post('/nz-payroll/api/v1/employee_configrations', Object.assign(state.editEmployee.payroll, payroll_additional_keys))
                .subscribe(
                    (res) => {
                        this.toastr.success(`Employee ${employee.first_name} ${employee.last_name} successfully updated`);
                        this.state$.next(state);
                    },
                    (err) => {
                        this.toastr.success(`Employee ${employee.first_name} ${employee.last_name} successfully updated but Payroll settings not saved.`);
                        this.state$.next(state);
                    }
                );
            } else {
                this.toastr.success(`Employee ${employee.first_name} ${employee.last_name} successfully updated`);
                this.state$.next(state);
            }
        }, (res)=>{
            state = update(state, { editEmployee:{ errors: { $set: res.json().errors } } });
            this.state$.next(state);
        });
    }
}
