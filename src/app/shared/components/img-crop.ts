import {Component, Input, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
let Croppie = require("croppie");


@Component({
    selector: 'img-crop',
    template: `<div #el></div>`,
})
export class ImgCrop {

    @ViewChild('el')
    public el:ElementRef;

    public _src:string;

    @Input()
    public set src(val){
        this._src = val;
        this.init(val);
    }
    public get src(){
        return this._src;
    }
    public croppie:any;

    public ngAfterViewInit() {
    }
    public init(val){
        if(!val){
            if(this.croppie) this.croppie.destroy();
            return;
        }
        this.croppie = new Croppie(this.el.nativeElement, {
            viewport: { width: 100, height: 100 },
            boundary: { width: 300, height: 300 },
            showZoomer: false,
            enableResize:true,
            enableExif:false,
            enforceBoundary:false,
            resizeControls: { 
                    width: true,
                    height: true
                },
            url: val
        });

        // viewport: {
        //     width: 100,
        //     height: 100,
        //     type: 'square'
	// },
        // boundary: { },
        // orientationControls: {
        //     enabled: true,
        //     leftClass: '',
        //     rightClass: ''
        // },
        // resizeControls: {
        //     width: true,
        //     height: true
        // },
        // customClass: '',
        // showZoomer: true,
        // enableZoom: true,
        // enableResize: false,
        // mouseWheelZoom: true,
        // enableExif: false,
        // enforceBoundary: true,
        // enableOrientation: false,
        // enableKeyMovement: true,
        // update: function () { }
    }
    public crop(){
        return this.croppie.result({type: 'blob'}).then((blob)=>{
            return blob;
        })
    }
    public destroy(){
    }

}
