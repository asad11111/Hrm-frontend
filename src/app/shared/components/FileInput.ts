
import {Component, Input, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
let Croppie = require("croppie");


@Component({
    selector: 'input-file',
    template: `
        <div [ngClass]="[ showName ? 'input-group' : '']">
            <label [ngClass]="[ showName ? 'input-group-btn' : '']">
                    <span [ngClass]="['btn', 'btn-primary', 'btn-' + size]">
                        Browse&hellip; 
                        <input type="file" style="display: none;" (change)="onChange($event)">
                    </span>
            </label>
            <input #input
                   class="form-control"
                   [value]="file?.name"
                   readonly
                   *ngIf="showName"
            >
        </div>
    `,
})
export class InputFile {

    @Input()
    public size = '';

    @Input()
    public showName = false;

    @Input()
    file:File|Blob;

    @Output()
    fileChange = new EventEmitter();

    onChange(e){
        let files  = e.target.files;
        if(files.length){
            this.file = files[0];
        }
        else { this.file = null}
        this.fileChange.emit(this.file);
    }

}
