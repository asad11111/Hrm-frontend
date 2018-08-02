import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from "@angular/router";
import {CompanyModules} from './company_modules';

var routes = RouterModule.forChild([
    {path: '', component: CompanyModules}
]);

@NgModule({
    imports: [routes, SharedModule],
    declarations: [CompanyModules],
    providers   : [],
})
export class SuperAdminModule
{

}
