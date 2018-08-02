import {NgModule} from '@angular/core'
import {RouterModule, Routes} from "@angular/router";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {SharedModule} from './shared/shared.module';
import {AuthModule, UserResolver, AuthGuard, Login, Register,ForgotPassword,ResetPassword, PkPayrollGuard, NzPayrollGuard} from './auth/auth.module';
import {ShellModule, Shell} from './shell/shell.module';

import {AppComponent} from "./app";
import {DashboardModule} from './dashboard/dashboard.module';
import {PendingLeaves} from './dashboard/pending-leaves';
import {Holiday} from './holiday/holiday';
import {ReviewConfig} from './review/review-config';
import {ToastModule } from "ng2-toastr";
import {Dashboard} from "./dashboard/dashboard";
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PopoverModule} from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {NgbPaginationModule} from './shared/pagination/pagination.module';
import {loadModule} from "./shared/services/loadModule";
import {HttpClient} from "./shared/services/Http";
import {Activities} from './activities/Activites';
import {ActivitiesHelper} from "./activities/ActivitiesHelper";
import { AccordionModule } from 'ngx-bootstrap/accordion';

declare let require:any;

const rootRouterConfig: Routes = [
    {path: 'login', component: Login},
    {path: 'register', component: Register},
    {path: 'password/forgot', component: ForgotPassword},
    {path: 'password/reset', component: ResetPassword},
    { path: '', data:{title: 'Home'}, component: Shell, canActivate: [AuthGuard], resolve: {user: UserResolver}, children:[
        {path: '', component: Dashboard },
        {path: 'activities', component: Activities},
        {path: 'settings', loadChildren: './settings/settings.module#SettingsModule'},
        {path: 'departments', loadChildren: './department/departments.module#DepartmentsModule'},
        {path: 'employees', loadChildren: './employee/employees.module#EmployeesModule'},
        {path: 'documents', loadChildren: './Documents/DocumentsModule#DocumentsModule'},
        {path: 'designations', loadChildren: './designation/designations.module#DesignationsModule'},
        {path: 'attendance', loadChildren: './attendance/attendance.module#AttendanceModule'},
        {path: 'leaves', loadChildren: './leaves/leave.module#LeavesModule'},
        {path: 'review', loadChildren: './review/review.module#ReviewModule'},
        {path: 'billing', loadChildren: './billing/billing.module#BillingModule'},
        {path: 'holidays',component: Holiday},
        {path: 'admin', loadChildren: './admin/super_admin.module#SuperAdminModule'},

        // Payroll Routes
        {path: 'nz-payroll', loadChildren: './nz-payroll/nz-payroll.module#NzPayrollModule', canActivate: [NzPayrollGuard]},
        {path: 'payroll', loadChildren: './payroll/payroll.module#PayrollModule', canActivate: [PkPayrollGuard]},
        
    ] },
];
@NgModule({
    declarations: [
        AppComponent, Holiday, PendingLeaves, Activities
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        ShellModule, AuthModule,
        ToastModule.forRoot(),
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        TabsModule.forRoot(),
        NgbPaginationModule.forRoot(),
        AccordionModule.forRoot(),
        DashboardModule,
        SharedModule,
        RouterModule.forRoot(rootRouterConfig)
    ],
    exports: [
    ],
    providers   : [
         HttpClient, ActivitiesHelper,
        // {provide: ToastOptions, useClass: CustomToastrOpts},
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        ReviewConfig
    ],
    bootstrap   : [AppComponent]
})
export class AppModule {
}



