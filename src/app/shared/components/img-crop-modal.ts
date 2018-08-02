import {Component, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {ImgCrop} from "./img-crop";

@Component({
    selector: 'img-crop-modal',
    template: `
        <modal [show]="src != undefined"
               [title]="title"
               (hide)="hide()">
            <div body>
                <img-crop #crop [src]="src"></img-crop>
            </div>
            <div footer>
                <button class="btn btn-default" (click)="hide()">Cancel</button>
                <button class="btn btn-primary" (click)="done()">Done</button>
            </div>
        </modal>
`
})
export class ImgCropModal {

    @ViewChild('crop')
    imgCrop:ImgCrop;

    @Input()
    public title:string;

    @Input()
    public src:string;

    @Output()
    public onHide = new EventEmitter();

    @Output()
    public onDone = new EventEmitter();

    hide(){
        this.onHide.emit();
    }
    public done(){
        this.imgCrop.crop().then((blob)=>{
            this.onDone.emit(blob);
        });
    }
}
