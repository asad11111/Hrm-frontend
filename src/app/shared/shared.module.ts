import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {RouterModule} from '@angular/router';
import {HttpModule, RequestOptions} from "@angular/http";
import { CommonModule }        from '@angular/common';
import {Pagination} from './components/pagination';
import {Errors} from './errors';
// import {ValuesPipe, KeysPipe} from './values.pipe';
import {Values, KeyVal, SafeHtmlPipe} from './pipes/object';
import {Btn} from './btn';
import {Datepicker} from './datepicker';
import {Timepicker} from './timepicker';
import {ChecklistDirective} from './checklist';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';
import {Modal} from './components/modal';
import {TokenedOptions} from './tokened-options';
import {UserDate, MomentPipe, MomentPipeTz} from './pipes/date';
import {Confirm} from './components/confirm';
import {Alert} from './components/alert';
import {Aside} from "./components/aside";
import {Box} from "./components/box";
import {NgbTabsetModule} from "./components/tabs/tabs.module";
import {NgbTabsetConfig} from "./components/tabs/tabset-config";
import {GroupByPipe} from './pipes/group-by';
import  {PageHeader} from './components/page-header';
import {RetryComponent} from './components/retry';
import {Spinner} from './components/spinner';
import {TableToCsv} from './services/table-to-csv';
import {ButtonRadioDirective} from './components/button-radio';
import {DateTimePicker} from './components/datetimepicker';
import {DurationPipe} from "./pipes/duration";
import {TimePipe} from "./pipes/time";
import {InfiniteScroll} from "./components/infinite-scroll";
import {PopoverModule} from 'ngx-bootstrap/popover';
import {Fetch} from "./Fetch";
import {Select2} from "./components/select2";
import {TabsModule} from 'ngx-bootstrap/tabs';
import {NgbPaginationModule} from './pagination/pagination.module';
import {MultiSelect2} from "./components/multi-select2";
import {HttpClient} from "./services/Http";
import {TokenedPipe} from "./pipes/tokened";
import { AccordionModule } from 'ngx-bootstrap/accordion';
import {Panel} from "./components/panel";
import {ImgCrop} from "./components/img-crop";
import {ImgCropModal} from "./components/img-crop-modal";
import {InputImg} from "./input-img";
import {InputFile} from "./components/FileInput";


@NgModule({
    declarations: [
        Errors, Values, Btn, Datepicker, Timepicker, ChecklistDirective, Modal,
        UserDate, Confirm, Alert, Aside, Pagination, Box, GroupByPipe, KeyVal,
        PageHeader, RetryComponent, Spinner, ButtonRadioDirective,
        DateTimePicker,
        DurationPipe, MomentPipe, TimePipe, MomentPipeTz, SafeHtmlPipe, TokenedPipe,
        InfiniteScroll, Select2, MultiSelect2, Panel,
        ImgCrop,
        ImgCropModal,
        InputImg,
        InputFile
    ],
    imports: [
        HttpModule,
        FormsModule, CommonModule, BsDropdownModule,
        ModalModule, RouterModule,
        NgbTabsetModule,
        PopoverModule,
        TabsModule,
        NgbPaginationModule,
        AccordionModule
    ],
    exports: [
        RouterModule, HttpModule,
        FormsModule, CommonModule, NgbTabsetModule,
        BsDropdownModule, ModalModule,
        Timepicker, Datepicker, ChecklistDirective, Btn, Modal,
        Errors,Values, UserDate, Confirm, Alert, Aside,
        Pagination, Box, GroupByPipe, KeyVal,
        PageHeader, RetryComponent, Spinner, ButtonRadioDirective,
        DateTimePicker,
        DurationPipe, TimePipe, MomentPipe, MomentPipeTz, SafeHtmlPipe, TokenedPipe,
        InfiniteScroll,
        PopoverModule,
        Select2, MultiSelect2,
        TabsModule,
        NgbPaginationModule,
        AccordionModule,
        Panel,
        ImgCrop,
        ImgCropModal,
        InputImg,
        InputFile
    ],
    providers: [
        TableToCsv, Fetch, HttpClient,
        {provide: RequestOptions, useClass: TokenedOptions}, NgbTabsetConfig
    ]

})
export class SharedModule {


}