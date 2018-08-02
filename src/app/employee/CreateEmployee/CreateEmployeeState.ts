import {Employee, User, Payroll} from "../Employee";

export class CreateEmployeeModalState {

    public show = false;

    public imgSrc = '/core/api/v1/employees/0/pic';

    public errors:any = {};

    public employee:Employee = new Employee();

    public user:User = new User();

    public payroll:Payroll = new Payroll();

    public showImgModal = false;

}
