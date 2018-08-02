import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import {TopNav} from './topnav';
import {SideNav} from './sidenav';
import {Shell} from './shell';


@NgModule({
    imports: [SharedModule],
    declarations: [
        TopNav, SideNav, Shell
    ],
    exports: [TopNav, SideNav, Shell],
    providers   : [],
})
export class ShellModule {
}

export {Shell};

