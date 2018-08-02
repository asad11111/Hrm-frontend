import {Component, Input} from '@angular/core';

@Component({
    selector   : 'errors',
    template: `<div class="alert alert-danger" *ngIf="hasErrors()">
                    <ul>
                        <li *ngFor="let error of errors | values">{{ error }}</li>
                    </ul>
                </div>`,
})
export class Errors {

    @Input()
    errors:any = {};

    public hasErrors()
    {
        return Object.keys(this.errors || {}).length !== 0;
    }

}
