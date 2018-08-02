import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {Settings} from "./settings";
import {SettingsGeneral} from "./general";
import {Roles} from "./roles";
import {SettingsOffices} from './offices';
import {SettingsModules} from './modules';
import {SettingsTaxes} from './taxes';
import {SettingsPayroll} from './payroll';
import {ReviewScale} from './reviewscale';
import {Shifts} from './shifts';
import {ReviewConfiguration} from './review_configuration';
import {MapsResolver} from "./google-maps-resolver";
import {OfficeMap} from "./office/office-map";
import {EmailTemplates} from "./email/email_templates";
import {SettingsAccount} from './account';
import {LeaveTypeModal} from "./leave/leave-types/LeaveTypeModal";
import {LeaveTypes} from "./leave/leave-types/LeaveTypes";
import {LeaveSettings} from "./leave/LeaveSettings";
import {Notifications} from "./notifications/notifications";


let routes = RouterModule.forChild([
    {path: '', component:Settings, children:[
        {path: '', redirectTo: 'account'},
        {path: 'account', component: SettingsAccount},
        {path: 'general', component: SettingsGeneral},
        {path: 'offices', component: SettingsOffices, resolve: {maps: MapsResolver}},
        {path: 'roles', component: Roles},
        {path: 'modules', component: SettingsModules},
        {path: 'payroll', component: SettingsPayroll},
        {path: 'taxes', component: SettingsTaxes},
        {path: 'shifts', component:Shifts},
        {path: 'leaves', component: LeaveSettings},
        {path: 'review-scale', component:ReviewScale},
        {path: 'reviews', component:ReviewConfiguration },
        {path: 'email-templates', component:EmailTemplates }  ,
        {path: 'notifications', component:Notifications }        
        
    ]},
]);

@NgModule({
    imports: [routes, SharedModule],
    declarations: [
        Settings, SettingsAccount, SettingsGeneral,ReviewConfiguration,
        SettingsOffices, SettingsModules,SettingsTaxes,SettingsPayroll,ReviewScale,
        Roles, Shifts,Notifications,
        LeaveSettings, LeaveTypes,LeaveTypeModal,
        OfficeMap, EmailTemplates
    ],
    providers   : [MapsResolver],
})
export class SettingsModule {


}


