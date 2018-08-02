import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import {RouterModule } from '@angular/router';
import {EmployeesList} from './EmployeesList/EmployeesList';
import {TreeEmployees} from "./tree-employees";
import {BulkUploadEmployees} from './bulk-upload-employees';
import {EmployeeProfile} from "./employee-profile";
import {AssignShiftModal} from "./shift/assign-shift-modal";
import {EmployeeListShifts} from "./shift/list-shifts";
import {EmployeeShiftsStore} from './shift/store';
import {EmployeeShiftsView} from './shift/employee-shifts-view';
import {EmployeeImageModal} from './profile/image-modal';
import {CreateEmployeeModal} from './CreateEmployee/CreateEmployeeModal';
import {EditEmployeeModal} from "./EditEmployee/EditEmployeeModal";
// import {EditEmployeeShifts} from './edit-employee/edit-employee-shifts';
import {ImageCropperModule} from "../img-cropper/src/imageCropperModule";
import {EmployeeLeaves} from './leaves/employee-leaves';
import {EmployeeAttendance} from './attendance/employee_attendance';
import {ProfileDetails} from "./profile/profile-details";
import {RecentClocksCounts} from "./profile/recent-clocks-counts";
import {ProfileAvgTime} from "./profile/average-time";
import {OverallAttendanceStatistics} from "./profile/overall-attendance-statistics/OverallAttendanceStatistics";
import {OverallLeaveStatistics} from "./profile/overall-leave-statistics/component";
import {ReviewSummary} from "./profile/review-summary/component";
import {OverallLeavesHolidaysHeatMap} from "./profile/overall-leaves-holidays-heatmap/component";
import {OverallReviewScore} from "./profile/overall-review-score/component";
import {EmployeesView} from "./EmployeesView";
import {EmployeeStore} from "./EmployeeStore";

let routes = RouterModule.forChild([
    {path: '', component: EmployeesView},
    {path: 'tree', component:TreeEmployees},
    {path: 'import', component: BulkUploadEmployees},
    {path: ':id', component: EmployeeProfile},
    {path: ':id/leaves', component: EmployeeLeaves},
    {path: ':id/attendance', component: EmployeeAttendance},
    {path: ':id/:type', component: EmployeesView},
]);
@NgModule({
    imports: [routes, SharedModule,  ImageCropperModule],
    declarations: [
        EmployeesView,
        EmployeesList,
        TreeEmployees,
        EmployeeProfile,
        CreateEmployeeModal,
        EmployeeLeaves,
        EmployeeAttendance,
        AssignShiftModal,
        EmployeeListShifts,
        EmployeeShiftsView,
        EditEmployeeModal,
        BulkUploadEmployees,
        EmployeeImageModal,
        EmployeeProfile,
        ProfileDetails,
        RecentClocksCounts,
        ProfileAvgTime,
        OverallAttendanceStatistics,
        OverallLeaveStatistics,
        ReviewSummary,
        OverallLeavesHolidaysHeatMap,
        OverallReviewScore
    ],
    providers   : [
        EmployeeStore,
        EmployeeShiftsStore
    ],
})
export class EmployeesModule {
}


