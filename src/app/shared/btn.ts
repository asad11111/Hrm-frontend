import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector   : 'btn',
    template: `<button [ngClass]="classes" [disabled]="busy || disabled">
                    <i [ngClass]="getIcon()"></i>
                    <ng-content></ng-content>
               </button>`,
})
export class Btn {

    @Input()
    icon:string = '';

    @Input()
    disabled:boolean = false;

    @Input()
    type:string = 'default';

    @Input()
    busy:boolean = false;

    @Input()
    size:string = 'md';

    classes:any = ['btn'];

    constructor(){
    }
    ngOnInit(){
        this.classes.push(`btn-${this.type}`);
        if(this.size){
            this.classes.push(`btn-${this.size}`)
        }
    }
    onClick(e){
        // this.click.emit(e);
    }
    getIcon()
    {
        if(this.busy) return 'fa fa-spin fa-circle-o-notch'
        return this.icon;
    }

}
