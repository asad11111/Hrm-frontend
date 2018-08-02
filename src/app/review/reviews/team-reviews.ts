import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { Permission } from '../../auth/auth.module';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from "@angular/router";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../../shared/components/confirm";
import { ReviewRating } from '../review-rating';
import { ReviewConfig } from "../review-config";
import { Alert } from "../../shared/components/alert";
import { AuthService } from "../../auth/auth.service";

@Component({
    selector: 'team-reviews',
    templateUrl: './team-reviews.html',
})

export class TeamReviews {

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

    public reviewerId;

    @ViewChild('reviewee_details_popup')
    public reviewee_details_popup: ModalDirective;

    @ViewChild('review_deadline')
    public review_deadline: ModalDirective;

    @ViewChild('confirm')
    public confirm: Confirm;

    @ViewChild('alert')
    public alert: Alert;

    public fetching = false;

    public reviews: any = [];

    public review:any={};

    public revieweedetails:any=[];

    public selected_reviewee:any={};

    public rloaded:any=false;

    public reviewerRatings:any=[];

    public save_deadline_btn:any=" Save Deadline ";

    public data: any = {
        review_template: { template_type: 1 },
        reviewer: { status: 1, pros: '', cons: '', comments: '' },
        categories: [],
        questions: {},
        answers: {},
        employee: {
            employee: {},
            department: {},
            designation: {},
        }
    };

  

    public scores = [0, 1, 2, 3, 4, 5];
    constructor(
        protected http: Http,
        protected permission: Permission,
        protected route: ActivatedRoute,
        protected toastr: ToastsManager,
        protected reviewRating: ReviewRating,
        protected reviewConfig: ReviewConfig,
        protected auth: AuthService
    ) { }
  
    ngOnInit() {
        this.fetching = true;
        var currentUser=this.auth.getUser();
       this.http.get(`/review/api/v1/reviewee/${currentUser.employee.id}/team?employee_id=${currentUser.employee.id}`).subscribe((res) => {
            this.reviews = res.json().data;          
            this.rloaded=true;               
       },(res)=>{
           this.rloaded=true;   
           if (res.status != 422)  
                return this.toastr.error("There is no review of your team.", 'Reviewee');
       });
        
    }

    // reviewee_details_popup.show() select_reviewee
    select_reviewee(r){
        this.selected_reviewee=r;
        this.load_reviewee(r);
    }
 
    load_reviewee(r){

        this.http.get('/review/api/v1/my-reviews/'+r.reviewee_id).subscribe((res)=>{
                this.data = res.json().data;
                this.reviewee_details_popup.show();
            });        
    }


    reviewee_rating(){
       if(typeof this.data.reviewee=='object')
           return this.data.reviewee.rating || "N/A";
         return 'N/A';
    }

    /*********************************************** */


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
        var employeeIds = this.data.reviewers.filter((r)=>{
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
