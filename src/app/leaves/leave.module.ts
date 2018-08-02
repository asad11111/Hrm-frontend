import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router';

import {SubmitLeave} from "./submit-leave";
import {MyLeaves} from "./my-leaves";
import {Leave} from './leave';
import {SubmittedLeaves} from './submitted-leaves';
import {ManageLeaves} from './ManageLeaves/ManageLeaves';
import {ManageLeaveModal} from "./ManageLeaves/CreateLeave/LeaveModal";
import {LeaveHelpers} from "./LeaveHelpers";

let routes = RouterModule.forChild([
    {path: '',component: MyLeaves},
    {path: 'submitted',component: SubmittedLeaves},
    {path: 'manage',component: ManageLeaves},
    // {path: 'review',component:ApproveLeaves},
    // {path: ':id',component:AddLeaves},
]);

@NgModule({
    imports: [routes, SharedModule],
    declarations: [
        SubmitLeave, MyLeaves, SubmittedLeaves, Leave,
        ManageLeaves, ManageLeaveModal
    ],
    providers   : [LeaveHelpers],
})
export class LeavesModule {

}
