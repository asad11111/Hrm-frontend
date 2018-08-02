import {Component, Input,ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {Router,ActivatedRoute} from  "@angular/router"; 
import {ModalDirective} from 'ngx-bootstrap/modal';

interface ReviewTemplate {
    id?:number;
    title?:string;
    description?:string;
    status?:number;
}

interface Category {
    id?:number;
    title?:string;
    description?:string;
    status?:number;
    sorting?:number;
}
 
@Component({
    selector   : 'review-template-questions',
    templateUrl: './template-questions.html',
})
export class ReviewTemplateQuestions {

    @ViewChild('categories_form') public categories_form: ModalDirective;
    public review_template:ReviewTemplate={status:1};
    public template_questions:any;
    public sub_questions:any;
    public categories:any;
    public category:Category={status:1};
    public selected_review_template_id:number=0;
    public errors = {};
    public review_template_btn="Save category";

    constructor(protected http: Http,private activatedRoute: ActivatedRoute){
        
        this.categories={
                                "total":0,"per_page":15,"current_page":1,
                                "last_page":0,"next_page_url":null,
                                "prev_page_url":null,
                                "from":null,"to":null,"data":[]
                            }; 
        this.template_questions=this.categories;
        this.sub_questions=this.categories;               
        this.activatedRoute.params.subscribe((param: any) => {
                    this.selected_review_template_id =param['id'];
                    if(this.selected_review_template_id > 0 ){
                        this.http.get('/review/api/v1/reviews-templates/'+this.selected_review_template_id,{}).subscribe((data)=>{
                        this.review_template=data.json().data;     
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;
                    });
                    } 
                });
      
     }

    ngOnInit(){
         // load categories ...
       this.load_question_categories();
    } 
    public load_questions = (d) =>
        {
            var name=".loader_" + d.id;
            $(name).removeClass('hide');
             this.http.get('/review/api/v1/question-categories/'+d.id+'/questions?template_id='+ this.selected_review_template_id ,{}).subscribe((res)=>{
                     this.template_questions={['obj_'+d.id]:res.json() } 
                     this.sub_questions=res.json(); 
                     $(name).addClass('hide');                     
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;
                        $(name).addClass('hide');
                    });
        }

    public question_check = (q) =>
        {
            if(typeof this.template_questions=='undefined')
                return false;

            if(typeof this.template_questions['obj_'+q.id]=='undefined')
                return false;

             if(this.template_questions['obj_'+q.id].total == 0)
                return false;   

            if(this.template_questions['obj_'+q.id].total >0)
                return true;               
        }

    load_question_categories()
        {
           this.http.get('/review/api/v1/question-categories',{}).subscribe((data)=>{
                        this.categories =data.json();     
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;
                    });
        }
    
   public save_questions = (cat,question) =>
        {
            var target_url="/review/api/v1/reviews-templates/"+ this.selected_review_template_id  +"/question/"+question.id;
            var check_box_id="#question_" + question.id;
            if($(check_box_id).is(':checked'))
                {
                    this.http.post(target_url,{'status':true}).subscribe((res)=>{
                           
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;
                    });
                }else
                {
                    this.http.post(target_url,{'status':false}).subscribe((res)=>{
                           
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;
                    });
                }
                            
        }  
    save_category()
        {
             var target_url="/review/api/v1/question-categories";
            this.review_template_btn='Processing...';
            this.http.post(target_url,this.category).subscribe((res)=>{
                           this.load_question_categories();
                           this.review_template_btn=' Save category ';
                           this.categories_form.hide();
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.review_template_btn=' Save category ';
                        this.errors = res.json().errors;
                    });

        }   

}
