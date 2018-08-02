import {Component, Input, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'panel',
    template: `
        <div [ngClass]="['panel', 'panel-' + type, open ? 'panel-opened' : 'panel-closed']">
            <div class="panel-heading" role="tab" (click)="toggle($event)">
                <ng-content select="[header]"></ng-content>
                <div class="panel-title">
                    <ng-content select="[title]"></ng-content>
                </div>
            </div>
            <div [ngClass]="{'panel-collapse': true, 'collapse':true, 'in' : open}">
                <ng-content select="[body]">
                </ng-content>
            </div>
        </div>
`
})
export class Panel {

    @Input()
    public type = '';

    @Input()
    public open =  false;

    public onHide = new EventEmitter();

    toggle(event){
        if(event.target.classList.contains('no-panel-event')) return;
        this.open = !this.open;
    }
}
