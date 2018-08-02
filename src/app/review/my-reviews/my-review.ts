import {Component} from "@angular/core";
import {Http} from "@angular/http";
import {ActivatedRoute} from "@angular/router";
import {ReviewRating} from "../review-rating";
import {ReviewConfig} from "../review-config";

@Component({
    selector: 'my-review',
    templateUrl: './my-review.html',
})
export class MyReview {

    reviewer_type = {
        'Peer': 1,
        'Self': 2,
        'Manager': 3,
        'Direct Report': 4
    };
    weight_types = {
        1: 'peer_weight',
        2: 'self_weight',
        3: 'manager_weight',
        4: 'dr_weight',
    };

    public data:any = {
        review_template: {template_type: 1},
        reviewers: [],
        categories: [],
        questions: [],
        answers: [],
        employee: {
            employee: {},
            department: {},
            designation: {},
        }
    };


    constructor(
        public reviewRating:ReviewRating,
        protected http:Http,
        protected route:ActivatedRoute,
        public reviewConfig:ReviewConfig
    ){}
    ngOnInit(){
        this.route.params.subscribe((params:any)=>{
            this.http.get('/review/api/v1/my-reviews/'+params.id).subscribe((res)=>{
                this.data = res.json().data;
            });
        });
    }
    getAvgRating(type){
        var type_id = this.reviewer_type[type];
        var reviewers = this.data.reviewers.filter((r)=>{
            return r.type_id == type_id && r.rating;
        });
        var total = reviewers.map((m)=>{ return m.rating;}).reduce((u, v)=>{
            return u + v;
        }, 0);
        return total/reviewers.length || '-';
    }
    getAvgRatingByCategory(type, category_id){
        var type_id = this.reviewer_type[type];
        var employeeIds = this.data.reviewers.filter((r:any)=>{
            return r.type_id == type_id && r.rating;
        }).map((r)=>{
            return r.by_employee_id;
        });
        var questions = this.data.questions.filter((q)=>{
            return q.category_id == category_id;
        });
        var questionIds = questions.map((q)=>{
            return q.id;
        });
        var answers = this.data.answers.filter((a)=>{
            return (
                employeeIds.indexOf(a.by_employee_id) !== -1 &&
                questionIds.indexOf(a.question_id) !== -1
            );
        });
        var rating = this.reviewRating.calculate(answers, questions, this.data.review_template.template_type);
        return rating || '-';
    }
    getAvgRatingByQuestion(type, question_id)
    {
        var type_id = this.reviewer_type[type];
        var employeeIds = this.data.reviewers.filter((r)=>{
            return r.type_id == type_id && r.rating;
        }).map((r)=>{
            return r.by_employee_id;
        });
        var questions = this.data.questions.filter((q)=>{
            return q.id == question_id;
        });
        var questionIds = questions.map((q)=>{
            return q.id;
        });
        var answers = this.data.answers.filter((a)=>{
            return (
                employeeIds.indexOf(a.by_employee_id) !== -1 &&
                questionIds.indexOf(a.question_id) !== -1
            );
        });
        var rating = this.reviewRating.calculate(answers, questions, this.data.review_template.template_type);
        return rating || '--'
    }
    getTotalAverageByQuestion(question_id)
    {
        var answers = this.data.answers.filter((a)=>{
            return a.answer != 0 && a.question_id == question_id;
        });
        var result = answers.map((a)=>{
            var r = this.data.reviewers.find((r)=>{
                return r.by_employee_id == a.by_employee_id;
            });
            var weightType = this.weight_types[r.type_id];
            return {rating: a.answer, weight: this.data.review_template[weightType]}
        });
        var rate = result.map((r)=>{
            return [r.rating * r.weight, r.weight];
        }).reduce((u, v)=>{
            return [u[0] + v[0],  u[1] + v[1]];
        }, [0, 0]);
        return this.reviewRating.roundOff(rate[0]/rate[1]) || 'N/A';
    }
    getCategory(category_id) {
        for(let c of this.data.categories){
            if(c.id == category_id) return c;
        }
    }
    getPcc(type){
        return this.data.reviewers.filter((r)=>{
            return notBlank(r[type]);
        }).map((r)=>{
            return r[type];
        });
    }

}
function notBlank(v){
    return !(v === '' || v === undefined || v === null);

}