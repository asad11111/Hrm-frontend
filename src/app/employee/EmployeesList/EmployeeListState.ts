import {Employee, Role, User} from "../Employee";
import {PaginatedResult} from "../../shared/Fetch";
import {Designation} from "../../designation/Designation";
import {Department} from "../../department/Department";

import {Http} from "@angular/http";
import {ActivatedRoute} from "@angular/router";

export class EmployeeListState {

    public response = new PaginatedResult<EmployeesResponse>();

    public filters:{
        q?:string,
        size?:number,
        designation_id?: number,
        department_id?:number,
        gender?:string
    } = { size: 15};

    public showPopover = false;

    public deleteEmployee:Employee = null;

    constructor(){
    }
}

export class EmployeesResponse {


    public users: {[key: number] : User } = {};

    public designations: {[key: number] : Designation } = {};

    public roles: {[key: number] : Role } = {};

    public employees: Employee[] = [];

    public departments: {[key: number]: Department} = {};

    public attendance: any = [];

}
