import {Component} from '@angular/core';
import {Http} from "@angular/http";

@Component({
    selector: 'my-reviews',
    templateUrl: './my-reviews.html',
})
export class MyReviews {

    public fetched = false;

    public data:any = {
        reviewees: [],
        reviews: {},
        review_types: {},
        reviewers: {},
        reviewer_types: {}
    };

    constructor(protected http:Http){

    }
    ngOnInit(){
        this.http.get('/review/api/v1/my-reviews').subscribe((res)=>{
            this.fetched = true;
            this.data = res.json().data;          
        });
    }
    filterReviewers(reviewee_id){
        return Object.values(this.data.reviewers).filter((reviewer:any)=>{
            return reviewer.reviewee_id == reviewee_id;
        });
    }
    completedPercentage(reviewee):any
    {
        var reviewers = this.filterReviewers(reviewee.id);
        var completed = reviewers.filter((reviewer:any)=>{
            return reviewer.status == 2;
        });
        return Math.floor(completed.length/reviewers.length * 100);
    }
    review_title(re){
        var frequency_id =  this.data.reviews[re.review_id].frequency_id;
        if(parseInt(frequency_id) > 0)
            if(this.data.review_types[frequency_id].title)
                return this.data.review_types[frequency_id].title;
                
        return 'NIL';
    }

}
