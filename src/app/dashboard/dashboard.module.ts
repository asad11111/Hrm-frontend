import {NgModule} from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import {DashboardStatsItem} from './components/dashboard-stats-item';
import {Dashboard} from './dashboard'
import {AttendancePie} from "./components/attendance-pie";
import {OfficeTiming} from "./components/office-timing";
import {ReviewsPie} from "./components/reviews-pie";
import {Calendar} from "./components/calendar";
import {UpComingLeaves} from "./components/upcoming-leaves";
import {RecentClocks} from "./components/recent-clocks";
import {TopAvgTime} from "./components/top-avg-time";
import {QuestionCategories} from "./components/question-categories";
import {TopPerformers} from "./components/top-performers";
import {ClockInOut} from './components/clock-in-out/component';
import {LeavePie} from "./components/leave-pie";

@NgModule({
    imports: [SharedModule],
    exports: [],
    declarations: [
        Dashboard, DashboardStatsItem,
        ReviewsPie, AttendancePie, OfficeTiming,
        Calendar, UpComingLeaves, RecentClocks,
        QuestionCategories, TopAvgTime, TopPerformers,
        ClockInOut,LeavePie
    ],
    providers: [],
})

export class DashboardModule {  }