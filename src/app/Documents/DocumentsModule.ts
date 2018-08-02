import {NgModule} from "@angular/core";
import {RouterModule } from '@angular/router';
import {SharedModule} from "../shared/shared.module";
import {DocumentsView} from "./DocumentsView";
import {DocumentModal} from "./DocumentModal";
import {DocumentPreviewModal} from "./DocumentPreviewModal";

let routes = RouterModule.forChild([
    {path: '', component: DocumentsView},
]);
@NgModule({
    imports: [routes, SharedModule],
    declarations: [
        DocumentsView, DocumentModal, DocumentPreviewModal
    ],
    providers   : [
    ],
})
export class DocumentsModule {

}

