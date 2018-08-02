import {Component, Input, EventEmitter, Output, HostListener} from '@angular/core';
import {defer} from "../helpers/defer";

@Component({
    selector: 'infinite-scroll',
    template: `<span></span>`
})
export class InfiniteScroll {

    @Input()
    public page = 1;

    @Output()
    public onNext = new EventEmitter();

    public ngOnInit(){
        // let win = $(window);
        // win.on('scroll', ()=>{
        // });
    }
    @HostListener('window:scroll', ['$event'])
    onScrollEvent($event){
        let win = $(window);
        if ($(document).height() - win.height() == win.scrollTop())
        {
            this.onNext.emit(this.page + 1);
        }
    }

}
