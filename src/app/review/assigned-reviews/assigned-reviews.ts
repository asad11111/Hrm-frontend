import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {Permission} from '../../auth/auth.module';

@Component({
    selector: 'list-assigned-reviews',
    templateUrl: './assigned-reviews.html',
    styles:[
        `.radio.radio-inline label {
            line-height: 1.2;

        }`
    ]
})
export class ListAssignedReviews {

    public fetching = false;

    public fetched = false;

    public data:any = {
        employees: {},
        reviews: {},
        reviewer_types: {},
        reviewers: [],
        reviewees: {},

    };

    public status:any = {
        0: 'Inactive',
        1: 'Pending',
        2: 'Completed'
    };

    public groupBy = 'period';

    public filter = 'all';

    constructor(
        protected http: Http,
        public permission:Permission,
    ){}
    ngOnInit(){
        this.http.get('/review/api/v1/assigned-reviews').subscribe((res)=>{
            this.fetched = true;
            this.data = res.json().data;
        });
    }
    filterReviewersForReviewee(reviewee_id){
        return Object.values(this.data.reviewers).filter((r:any)=>{
            var result =  reviewee_id == r.reviewee_id;
            if(this.filter == 'all') return result;
            if(this.filter == 'pending') return result && r.status != 2;
            if(this.filter == 'completed') return result && r.status == 2;
        });
    }
    filterReviewersForReview(review_id){
        var ids = Object.values(this.data.reviewees).filter((rv:any)=>{
            return rv.review_id === review_id;
        }).map((r:any)=>{
            return r.id
        });
        return Object.values(this.data.reviewers).filter((r:any)=>{
            var result =  ids.indexOf(r.reviewee_id) !== -1;
            if(this.filter == 'all') return result;
            if(this.filter == 'pending') return result && r.status != 2;
            if(this.filter == 'completed') return result && r.status == 2;
        });
    }
}
