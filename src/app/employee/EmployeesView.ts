import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {Permission} from '../auth/auth.module';
import {AuthService} from "../auth/auth.service";
import {EmployeeStore} from "./EmployeeStore";
import {Subscription} from "rxjs/Subscription";
import {EmployeeViewState} from "./EmployeesViewState";

@Component({
    selector: 'employees-view',
    templateUrl: './EmployeesView.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesView {

    private sub: Subscription;

    public state:EmployeeViewState;

    constructor(public store:EmployeeStore, private cd:ChangeDetectorRef){

    }
    ngOnInit(){
        this.sub = this.store.state$.subscribe((state)=>{
            this.state = state;
            this.cd.markForCheck();
        }, (e)=>{

        });
    }
    ngOnDestroy(){
        this.sub.unsubscribe();
    }
}
