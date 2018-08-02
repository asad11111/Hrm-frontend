import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import {ListDepartment} from "./list-department";
import {AddDepartment} from "./add-department";
import {EditDepartment} from "./edit-department";
import "./tree.css";

let routes = RouterModule.forChild([
    {path: '',component: ListDepartment},
    {path: 'create',component:AddDepartment},
]);

@NgModule({
    imports: [routes, SharedModule],
    declarations: [
        ListDepartment, AddDepartment, EditDepartment
    ],
    providers   : [],
})
export class DepartmentsModule {

}

