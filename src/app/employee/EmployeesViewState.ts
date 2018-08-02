import {EmployeeListState} from "./EmployeesList/EmployeeListState";
import {Designation} from "../designation/Designation";
import {Department} from "../department/Department";
import {FetchedArrayResult, FetchedResult} from "../shared/Fetch";
import {Employee, Role} from "./Employee";
import {CreateEmployeeModalState} from "./CreateEmployee/CreateEmployeeState";
import {EditEmployeeModalState} from "./EditEmployee/EditEmployeeState";

export class EmployeeViewState {

    public employeesList = new EmployeeListState;

    public designations = new FetchedArrayResult<Designation>();

    public departments = new FetchedArrayResult<Department>();

    public roles = new FetchedArrayResult<Role>();

    public employees = new FetchedArrayResult<Employee>();

    public createEmployee = new CreateEmployeeModalState();

    public editEmployee = new EditEmployeeModalState();


}
