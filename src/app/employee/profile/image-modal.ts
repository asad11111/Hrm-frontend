import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from '@angular/router';
import {CropperSettings} from "../../img-cropper/src/cropperSettings";

@Component({
    selector   : 'employee-image-modal',
    templateUrl: './image-modal.html',
})
export class EmployeeImageModal {

    public cropperSettings:CropperSettings;

    @Input()
    public data:any = {};

    @Input()
    public show = false;

    @Output()
    public onDone = new EventEmitter();

    @Output()
    public onHide = new EventEmitter();

    constructor(){
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.minWidth = 150;
        this.cropperSettings.minHeight = 150;
        this.cropperSettings.croppedWidth =300;
        this.cropperSettings.croppedHeight = 300;
        this.cropperSettings.canvasWidth = 400;
        this.cropperSettings.canvasHeight = 300;
    }
    done(){
        this.onDone.emit(this.data.image);
        this.onHide.emit();
    }
}
