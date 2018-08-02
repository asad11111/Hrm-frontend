
import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'pagination',
    template: `
        <ul class="pagination" *ngIf="visible">
            <li [ngClass]="{disabled: page === 1}">
                <a aria-label="Previous" (click)="pageChanged(page - 1)">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li *ngFor="let p of pages" [ngClass]="{'active' : p == page, 'disabled': p === '...' }">
                <a (click)="p !== '...' && pageChanged(p)">{{p}}</a>
            </li>
            <li [ngClass]="{disabled: pages[pages.length -1] === page}">
                <a aria-label="Next" (click)="pageChanged(page + 1)">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    `
})
export class Pagination {

    public _items = 1;

    @Input()
    public set items(val){
        this._items = val;
        this.calculatePages();
    }
    public get items (){ return this._items; }

    public _perPage = 1;

    @Input()
    public set perPage(val){
        this._perPage = val;
        this.calculatePages();
    }
    public get perPage(){
        return this._perPage;
    }

    public _page = 1;

    @Input()
    public set page(val){
        this._page = val;
        this.calculatePages();
    }
    public get page(){
        return this._page;
    }

    @Output()
    public pageChange = new EventEmitter();

    public pages = [];

    @Input()
    public show = 5;

    public visible = false;

    public calculatePages(){
        let pages = Math.ceil((this._items || 1)/ (this._perPage || 1));
        if(pages  < 1) return this.visible = false;
        this.visible = true;
        let show = this.show - 1;
        if(show > pages) show = pages;
        let page =  this._page || 1;

        let afterItems = Math.ceil(show/2);
        let beforeItems = show - afterItems;

        if(page - beforeItems < 1){
            let shift = beforeItems - page + 1;
            beforeItems = beforeItems - shift;
            afterItems = afterItems + shift;
        }
        else if(afterItems + page > pages){
            let shift = afterItems + page - pages - 1;
            afterItems = afterItems - shift;
            beforeItems = beforeItems + shift;
        }

        let a1 = this.genArray( page - beforeItems, page);
        let a2 = this.genArray(page, page + afterItems);
        let a3 = a1.concat(a2);

        if(a3[0] - 1 > 1){
            a3.unshift('...');
        }
        if(pages - a3[a3.length - 1] > 1){
            a3.push('...');
        }
        if(a3[0] !== 1){
            a3.unshift(1);
        }
        if(a3[a3.length - 1] != pages){
            a3.push(pages);
        }
        this.pages = a3;
    }
    public genArray(start, end){
        let list = [];
        for (let i = start; i < end; i++) {
            list.push(i);
        }
        return list;
    }
    public pageChanged(page){
        if(page != this.page){
            this.pageChange.emit(page);
        }
    }

}