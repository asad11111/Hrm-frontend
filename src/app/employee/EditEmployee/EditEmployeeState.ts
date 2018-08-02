import {Employee, User, Payroll} from "../Employee";

export class EditEmployeeModalState {

    public show = false;

    public saving = false;

    public imgSrc;

    public errors:any = {};

    public employee:Employee = new Employee();

    public payroll:Payroll = new Payroll();

    public user:User = new User();

}
