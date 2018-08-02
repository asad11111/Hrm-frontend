import {Component, Input, EventEmitter, Output} from '@angular/core';
import {defer} from "../helpers/defer";

@Component({
    selector: 'confirm',
    template: `
        <modal [show]="_show" [title]="title" (hide)="hide(false)">
            <div body>
                {{message}}
            </div>
            <div footer>
                <button class="btn btn-default" (click)="hide(false)">No</button>
                <button class="btn btn-primary" (click)="hide(true)">Yes</button>
            </div>
        </modal>
`
})
export class Confirm {

    @Input()
    _show = false;

    @Input()
    message = '';

    @Input()
    title = 'Are you sure?';

    @Output()
    onSelect= new EventEmitter();

    deferred:any;

    show(message):Promise<boolean>{
        this.message = message;
        this.deferred = defer();
        this._show = true;
        return this.deferred.promise;
    }
    hide(opt){
        if(this.deferred)
            this.deferred.resolve(opt);
        this._show = false;
        this.onSelect.emit(opt);
    }

}
