import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import {ListDesignation} from "./list-designation";
import {AddDesignation} from "./add-designation";

import {TreeDesignation} from "./tree-designation";
import {EditDesignation} from "./edit-designation";

var routes = RouterModule.forChild([
    {path: '',component:ListDesignation },
    {path: 'tree',component:TreeDesignation },
]);

@NgModule({
    imports: [routes, SharedModule],
    declarations: [
        ListDesignation, AddDesignation, TreeDesignation, EditDesignation
    ],
    providers   : [],
})
export class DesignationsModule {
}
