import {Component, OnInit, Input} from '@angular/core';
let src = require('./spinner.svg');

let template = `
<div class="sk-spinner sk-spinner-wave">
    <div class="sk-rect1"></div>
    <div class="sk-rect2"></div>
    <div class="sk-rect3"></div>
    <div class="sk-rect4"></div>
    <div class="sk-rect5"></div>
</div>`;

template = `
<div style="text-align: center">
    <img [width]="width || '50x' + 'px'" src="${src}"/>
</div>
`;
@Component({
    selector: 'spinner',
    template: template
})
export class Spinner {

    @Input()
    public width = '50';

}