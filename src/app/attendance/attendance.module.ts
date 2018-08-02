import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import {AttendanceReport} from './attendance_report';
import {AttendanceStatusReport} from './attendance_report/attendance-status-report';
import {AttendanceHoursReport} from './attendance_report/attendance-hours-report';
import {AttendanceEmployeeReport} from './attendance_report/attendance-employee-report';
import {AttendanceDailyReport} from './attendance_report/attendance-daily-report';
import {AttendanceMonthlyReport} from './attendance_report/attendance-monthly-report';
import {Clocks} from './clocks/clocks';
import {EditClockModal} from './clocks/edit-clock-modal';
import {CreateClockModal} from './clocks/create-clock-modal';
import {ShiftSchedule} from './schedule/shift-schedule';
import {AssignShiftModal} from './schedule/assign-shift-modal';

let routes = RouterModule.forChild([
    {path: 'reports',component:AttendanceReport},
    {path: 'clocks',component:Clocks},
    {path: 'schedule',component:ShiftSchedule},
]);

@NgModule({
    imports: [routes, SharedModule],
    declarations: [
        AttendanceReport,
        AttendanceStatusReport, AttendanceHoursReport, AttendanceEmployeeReport,
        AttendanceDailyReport, AttendanceMonthlyReport,
        Clocks, EditClockModal, CreateClockModal,
        ShiftSchedule, AssignShiftModal,
    ],
    providers   : [],
})
export class AttendanceModule {

}
