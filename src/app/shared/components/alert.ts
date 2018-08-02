import {Component, Input, EventEmitter, Output} from '@angular/core';
import {defer} from "../helpers/defer";

@Component({
    selector: 'alert',
    template: `
        <modal [show]="_show" [title]="title" (hide)="hide(false)">
            <div body>
                {{message}}
            </div>
            <div footer>
                <button class="btn btn-primary" (click)="hide(true)">Ok</button>
            </div>
        </modal>
`
})
export class Alert {

    _show = false;

    message = '';

    @Input()
    title = 'Alert';

    deferred:any;

    show(message){
        this.message = message;
        this.deferred = defer();
        this._show = true;
        return this.deferred.promise;
    }
    hide(opt){
        this.deferred.resolve(opt);
        this._show = false;
    }

}

