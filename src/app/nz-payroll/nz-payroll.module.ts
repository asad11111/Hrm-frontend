import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import {Payrolls} from "./payrolls";
import {CreatePayroll} from "./create-payroll";
import {EmployeeSalaryModal} from "./employee-salary-modal";
import {SalarySlips} from "./salary-slips";
import {SalarySlipModal} from "./salary-slip-modal";
import {EmployeeSalaries} from "./salary/employee-salaries";
import {SalariesImportModal} from "./salary/SalariesImportModal";


let routes = RouterModule.forChild([
    {path: '',component: Payrolls},
    {path: 'salaries',component: EmployeeSalaries},
    {path: ':id/slips', component: SalarySlips},
]);

@NgModule({
    imports: [routes, SharedModule],
    declarations: [
        Payrolls, CreatePayroll, SalarySlips, SalarySlipModal,
        EmployeeSalaries, EmployeeSalaryModal, SalariesImportModal
    ],
    providers   : [],
})
export class NzPayrollModule {

}
