import {NgModule, Component} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import "./billing-style.css";
import {Packages} from "./packages/packages";
import { MyBills } from "./mybills/my-bills";

var routes = RouterModule.forChild([
    {path: '', resolve: {}, children: [
        {path: 'packages',component:Packages},  
        {path: 'mybills',component:MyBills},         
    ]}
]);

@NgModule({
    imports: [routes, SharedModule],
    declarations: [Packages,MyBills],
    providers   : [],
    exports: []
})
export class BillingModule {

}

