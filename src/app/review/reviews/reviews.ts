import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import {Permission} from "../../auth/permission.service";
import { Confirm } from "../../shared/components/confirm";
import { Alert } from "../../shared/components/alert";
import { ToastsManager } from "ng2-toastr";


interface Review {
    id?: number;
    company_id?: number;
    office_id?: number;
    title?: string;
    for_employee_id?: number;
    type_id?: number;
    template_id?: number;
    description?: string;
    rating?: number;
    weighted_rating?: number;
    status?: number;
    deadline?: string;
    review_session_id?: number;
    review_edit_count?: number;
    starting_month?: string;

    peers?: any;
    managers?: any;
}

@Component({
    selector: 'reviews',
    templateUrl: './reviews.html',
})
export class Reviews {

    @ViewChild('confirmreviewer') confirm: Confirm;
    @ViewChild('alertpoup') alertpoup: Alert;
    
    public review: Review = {};
    public reviews:any;
    public departments: any =[];
    public selected_department_id: any = {};
    public dep_employees_more: any = [];

    public selected_review_id: number = 0;
    public errors = {};
    public review_btn = "Save review";

    constructor(protected http: Http,protected toastr:ToastsManager, public permission:Permission) {
        this.reviews = {
            "total": 0,
            "per_page": 15,
            "current_page": 1,
            "last_page": 0,
            "next_page_url": null,
            "prev_page_url": null,
            "from": null,
            "to": null,
            "data": []
        };
    }

    ngOnInit() {
        this.load_reviews(); 
    }
 
    load_employees_more(id = 0) {

        var target_url = '/core/api/v1/departments/' + id + '/employees';
        this.selected_department_id = id;
        this.http.get(target_url).subscribe((res) => {
            this.dep_employees_more = res.json().data;
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });

    }//load_employees

    load_reviews(page_id=1) {

        var target='/review/api/v1/reviews?page='+page_id;

        this.http.get(target).subscribe((res) => {
            this.reviews = res.json();
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });
    }
 
    remove_review = (d) => {

        this.confirm.show(`Are you sure you want to delete "${d.title}" `).then((opt) => {
            if (opt === false) return;         
            
        /////////////////////////////////////////////
        var target='/review/api/v1/reviews/' + d.id ;
        this.http.delete(target).subscribe((res) => {             
            this.toastr.success(`${d.title} removed.`, 'Review');
            this.load_reviews();
        }, (res) => {
            if (res.status != 422) return;
                this.errors = res.json().errors;
        });
            /////////////////////////////////////////////
        });

    }
}
