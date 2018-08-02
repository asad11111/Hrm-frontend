import {NgModule, Component} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {MyReviews} from "./my-reviews/my-reviews";
import {MyReview} from "./my-reviews/my-review";
import {ListAssignedReviews} from "./assigned-reviews/assigned-reviews";
import {AssignedReview} from "./assigned-reviews/assigned-review";

import {ReviewRating} from './review-rating'
import {Reviewtemplates} from "./reviews/reviewtemplates";
import {ReviewTemplateQuestions} from "./reviews/template-questions";
import {Reviews} from "./reviews/reviews";
import "./reviews/review-style.css"
import {CreateReviews} from "./reviews/create-reviews";
import {EditReviews} from "./reviews/edit-reviews";
import {QuestionsWeights} from "./reviews/questions-weights";
import {QuestionCategories} from "./reviews/categories";
import {ReviewConfigResolver} from './review-config';
import {ReviewDetails} from './reviews/review-details';
import {TeamReviews} from './reviews/team-reviews';

var routes = RouterModule.forChild([
    {path: '', resolve: {config: ReviewConfigResolver}, children: [
        {path: 'my-reviews', component: MyReviews},
        {path: 'my-reviews/:id', component: MyReview},
        {path: 'assigned-reviews', component: ListAssignedReviews},
        {path: 'assigned-reviews/:id',component: AssignedReview},
        {path: 'reviews',component:Reviewtemplates},
        {path: 'reviews/review-templates/:id',component:ReviewTemplateQuestions},
        {path: 'reviews/categories',component:QuestionCategories },
        {path: 'reviews/assign-weights/:id',component:QuestionsWeights },
        {path: 'reviews/reviews-list',component:Reviews },
        {path: 'reviews/create',component:CreateReviews },
        {path: 'reviews/:id', component:EditReviews},
        {path: 'reviews/:id/details', component:ReviewDetails},
        {path: 'team', component:TeamReviews},
        
    ]}
]);

@NgModule({
    imports: [routes, SharedModule],
    declarations: [
        [Reviewtemplates,ReviewTemplateQuestions,QuestionCategories,ReviewDetails,TeamReviews,
            EditReviews, QuestionsWeights,Reviews,CreateReviews],
        [MyReview, MyReviews, ListAssignedReviews, AssignedReview]

    ],
    providers   : [ReviewRating, ReviewConfigResolver],
    exports: []
})
export class ReviewModule {

}

