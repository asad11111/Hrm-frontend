import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector   : 'input-img',
    template: `
        <div style="position: relative">
            <input style="position: absolute;width: 100%;height: 100%; opacity: 0;"
                   type="file"
                   (change)="change($event)"
            />
            <button [ngClass]="classes" [disabled]="busy || disabled">
                <i [ngClass]="getIcon()"></i>
                <ng-content></ng-content>
            </button>
        </div>
    `,
})
export class InputImg {

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

    @Output()
    public onChange = new EventEmitter();

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
        if(this.busy) return 'fa fa-spin fa-circle-o-notch';
        return this.icon;
    }
    change(e){
        this.onChange.emit(e.target.files[0]);
    }

}
