import { Component, OnInit ,Input } from '@angular/core';
import './question-categories.css';




@Component({
    selector: 'question-categories',
    templateUrl: './question-categories.html'
})
export class QuestionCategories implements OnInit {

    @Input() public performData;

    constructor() { }

    ngOnInit() { }

    loadList=(data)=>{      return data;    }

}