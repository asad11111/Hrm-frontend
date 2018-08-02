import {Component, Input, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {Permission} from '../../auth/auth.module';
import {ActivatedRoute} from "@angular/router";
import {ToastsManager} from "ng2-toastr";
import {Confirm} from "../../shared/components/confirm";
import {ReviewRating} from '../review-rating';
import {ReviewConfig} from "../review-config";
import {Alert} from "../../shared/components/alert";

var styles =  [`
.info-sticky-box {
    top: 130px;
}
.info-sticky-box .info-box-content {
	border-top:1px solid #eee;
	border-right:1px solid #eee;
	border-bottom: none;
}
.review-question {
    margin-bottom: 10px;
}
.review-question textarea {
    margin-top: 10px;
}
.review-question {
    padding-right: 20px;
}
.review-question .review-question-rating {
    float: right;
    font-size: 1.1em;
}
.review-question .review-question-description {
    margin-left: 15px;
}
.review-question .review-question-comments {
    margin-left: 15px;
}
.employee-details ul {
    padding-left: 70px;
}
`];

@Component({
    selector: 'assigned-review',
    templateUrl: './assigned-review.html',
    styles: styles
})
export class AssignedReview {

    public reviewerId;

    @ViewChild('confirm')
    public confirm:Confirm;

    @ViewChild('alert')
    public alert:Alert;

    public fetching = false;

    public data:any = {
        review_template: {template_type: 1},
        reviewer: {status:1, pros:'', cons:'', comments: ''},
        categories: [],
        questions: {},
        answers: {},
        employee: {
            employee: {},
            department: {},
            designation: {},
        }
    };

    public scores = [0,1,2,3,4,5];

    constructor(
        protected http: Http,
        protected permission:Permission,
        protected route:ActivatedRoute,
        protected toastr:ToastsManager,
        protected reviewRating:ReviewRating,
        public reviewConfig:ReviewConfig
    ){
        console.log(this.reviewConfig);
    }
    ngOnInit(){
        this.fetching = true;
        this.route.params.subscribe((params:any)=>{
            this.reviewerId = params.id;
            this.http.get(`/review/api/v1/assigned-reviews/${params.id}`).subscribe((res)=>{
                this.data = res.json().data;
                if(Object.keys(this.data.answers).length !== 0) return;
                this.setDefaultAnswers();
                this.fetching = false;
            });
        });
    }
    setDefaultAnswers(){
        Object.values(this.data.questions).forEach((question:any)=>{
            this.data.answers[question.id] = {question_id: question.id, answer: 0};
        });
    }
    averageRating()
    {
        var rating = this.reviewRating.calculate(
            this.data.answers,
            this.data.questions,
            this.data.review_template.template_type
        );
        return rating
    }
    toggleComment($e, a){
        $e.preventDefault();
        a.comments = a.comments != null ? null : '';
    }
    saveAsDraft(){
        this._save(true);
    }
    save(){
        if(this.reviewConfig.config.all_question_required != '0') {
            if(false == this.allAnswered()){
                var msg = 'You should have to answer all questions before submitting this reviews.';
                return this.alert.show(msg);
            }
        }
        this.confirm.show(`
        Are you sure to want to complete this review. You will not be able to edit afterwards 
        otherwise save as draft
        `).then((opt)=>{
            if(false == opt) return;
            this._save(false);
        });
    }
    _save(asDraft) {
        var data = {
            asDraft: asDraft,
            reviewer_id: this.reviewerId,
            answers: this.data.answers,
            reviewer: {
                pros: this.data.reviewer.pros,
                cons: this.data.reviewer.cons,
                comments: this.data.reviewer.comments,
            }
        };
        this.http.post('review/api/v1/assigned-reviews', data).subscribe((res)=>{
            this.toastr.success(`saved successfully`, 'Review');
            if(asDraft) return;
            this.data.reviewer.status = 2;
        });
    }
    allAnswered() {
        return Object.values(this.data.answers).every((a:any)=>{
            return a.answer !== 0;
        });
    }
}
