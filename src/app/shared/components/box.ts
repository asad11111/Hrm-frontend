import {Component, Input, EventEmitter, Output} from '@angular/core';

var template = `
<div [ngClass]="['ibox']">

    <div class="ibox-title">
        <ng-content select="[header]"></ng-content>
    </div>
    
    <div class="ibox-content" *ngIf="busy">
        <spinner></spinner>
    </div>
    
    <ng-content select="[body]">
    </ng-content>
    
</div>
`;

@Component({
    selector: 'box',
    template: template
})
export class Box {

    @Input()
    public busy = false;

    @Input()
    public type = 'solid';

    @Input()
    public failed = false;

    public message = 'Something went wrong For retry click on retry.';

    constructor(){

    }
}

