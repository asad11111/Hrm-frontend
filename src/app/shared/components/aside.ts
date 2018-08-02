import {Component, Input, transition, trigger, style, animate, EventEmitter, Output} from '@angular/core';
import {defer} from "../helpers/defer";

@Component({
    selector: 'aside-modal',
    template: `
        <div class="aside" *ngIf="show" [@fadeIn]="show" (click)="hideByBackDrop($event)">
            <div class="aside-dialog" [@slideIn]="show">
                <div class="aside-header">
                    <button type="button" class="close" (click)="hide()">×</button>
                    <h4 class="aside-title">{{title}}</h4>
                </div>
                <div class="aside-body">
                    <ng-content></ng-content>
                </div>
            </div>
        </div>
    `,
    styles: [`
       .aside {
            background: rgba(0,0,0,0.3);
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0 ;
            z-index: 1050;
       }
       .aside .aside-dialog {
            background: #FFF;
            margin: auto 0 auto auto;
            height: 100%;
            width: 350px;
       }
       .aside-dialog .aside-header {
            width: 100%;
            background: #3c8dbc;
            height: 50px;
       }
       .aside-header .close {
           padding: 11px;
           font-size: 25px;
           opacity: .8;
           color: #FFF;
           outline: none;
       }
       .aside-header .aside-title {
            margin: 0;
            padding-top: 15px;
            padding-left: 10px;
            color: #FFF;
            font-size: 18px;
       }
       .aside-dialog .aside-body {
        padding: 20px;
       }
    `],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({opacity: 0}),
                animate(200, style({opacity: 1}))
            ]),
            transition(':leave', [
                animate(200, style({opacity: 0}))
            ])
        ]),
        trigger('slideIn', [
            transition(':enter', [
                style({marginRight: '-350px'}),
                animate(200, style({marginRight: 0}))
            ]),
            transition(':leave', [
                animate(200, style({marginRight: '-350px'}))
            ])
        ])
    ]
})
export class Aside {

    @Input()
    show:boolean = false;

    @Output()
    showChange = new EventEmitter<boolean>();

    @Input()
    title:string = 'Title';

    hideByBackDrop(e){
        if(e.target.classList.contains('aside')){
            this.hide();
        }
    }
    hide(){
        this.show = false;
        this.showChange.emit(this.show);
    }

}
