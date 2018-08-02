import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';

const template = `
<div *ngIf="show" class="text-center">
    <h4>{{message}}</h4>
    <button class="btn btn-primary" (click)="retry.emit()">
        <span class="glyphicon glyphicon-repeat"></span> Retry
    </button>
</div>
`;
@Component({
    selector: 'retry',
    template: template
})
export class RetryComponent implements OnInit {

    @Input()
    public show = false;

    @Output()
    public retry = new EventEmitter();

    @Input()
    public message = 'Something went wrong. For retrying click';

    constructor() {

    }
    ngOnInit() {

    }
}