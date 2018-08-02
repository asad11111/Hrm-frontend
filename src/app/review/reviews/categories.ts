import {Component, Input,ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {Router, ActivatedRoute} from  "@angular/router";
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Permission} from "../../auth/permission.service";
import { Confirm } from "../../shared/components/confirm";
import { Alert } from "../../shared/components/alert";
import { ToastsManager } from "ng2-toastr";

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

interface Question {
    id?:number;
    category_id?:number;
    title?:string;
    description?:string;
    status?:number;
    sorting?:number;
}

 
@Component({
    selector   : 'categories',
    templateUrl: './categories.html',
})
export class QuestionCategories {

    @ViewChild('categories_form') public categories_form: ModalDirective;
    @ViewChild('question_form') public question_form: ModalDirective;
    @ViewChild('confirmreviewer') confirm: Confirm;
    @ViewChild('alertpoup') alertpoup: Alert;
    
    
    public review_template:ReviewTemplate={status:1};
    public template_questions:any;
    public sub_questions:any;
    public categories:any;
    public category:Category={status:1};
    public selected_category:any;
    public selected_category_id:number;
    public selected_question_id:number;
    public question:Question={status:1};
    public errors = {};
    public review_template_btn="Save category";
    public question_btn="Save Question";

    constructor(public permission:Permission, protected http: Http,private activatedRoute: ActivatedRoute,protected toastr:ToastsManager){
        
       // console.log(permission);

        this.categories={       "total":0,"per_page":15,"current_page":1,
                                "last_page":0,"next_page_url":null,
                                "prev_page_url":null,
                                "from":null,"to":null,"data":[]
                            }; 
        this.template_questions=this.categories;
        this.sub_questions=this.categories;         
     }

    ngOnInit(){
         // load categories ...
       this.load_question_categories();
    } 
    public load_questions = (d,p=1) =>
        {
            var name=".loder_" + d.id;
            $(name).removeClass('hide');
             this.http.get('/review/api/v1/question-categories/'+d.id+'/questions?page=' + p,{}).subscribe((res)=>{
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

    load_question_categories(p=1)
        {            
           this.http.get('/review/api/v1/question-categories?page=' + p).subscribe((data)=>{
                        this.categories =data.json();     
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;
                    });
        }
    edit_category(cat){
         var target_url="/review/api/v1/question-categories/"+cat.id;
         this.http.get(target_url,{}).subscribe((res)=>{
                        this.category =res.json().data; 
                        this.selected_category_id=res.json().data.id; 
                        this.categories_form.show();    
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;
                    });                    
    }
 

    categories_form_show(){
        this.selected_category_id=0;
        this.category={status:1};
        this.categories_form.show();
    }
    public edit_question = (q,cat) =>
        {
            var target_url="/review/api/v1/questions/"+q.id;
            this.http.get(target_url,{}).subscribe((res)=>{
                            this.question =res.json().data; 
                            this.selected_question_id=res.json().data.id; 
                            this.selected_category=cat;
                            this.question_form.show();    
                        }, (res)=>{
                            if(res.status != 422) return;
                            this.errors = res.json().errors;
                        });                    
        }

    add_question(cat){        
        this.question={status:1};
        this.question.category_id=cat.id;
        this.selected_category=cat;
        this.selected_question_id=0;
        this.question_form.show();
    }

    save_question()
        {
            if(this.selected_question_id > 0 )
                var target_url="/review/api/v1/questions/"+this.selected_question_id+"/update";
            else
                var target_url="/review/api/v1/questions";

            this.question_btn='Processing...';
            this.http.post(target_url,this.question).subscribe((res)=>{
                           this.load_questions(this.selected_category);
                           this.question_btn=' Save question ';
                           this.question_form.hide();
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.question_btn=' Save question ';
                        this.alert_errors(res.json().errors)   ; 
                        
                    });
        }
 
    alert_errors(errors){

         for(var i in errors)
                        {  var e=errors[i];
                           var   message=e.join(`\n`);
                            this.toastr.error(message);
                        }   
    }    
    save_category()
        {
            if(this.selected_category_id > 0 )
                var target_url="/review/api/v1/question-categories/"+this.selected_category_id+"/update";
            else
                var target_url="/review/api/v1/question-categories";

            this.review_template_btn='Processing...';
            this.http.post(target_url,this.category).subscribe((res)=>{
                           this.load_question_categories();
                           this.review_template_btn=' Save category ';
                           this.categories_form.hide();
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.review_template_btn=' Save category ';
                        this.alert_errors(res.json().errors)   ; 
                    });

        }   
   // del category .......... 
  public  del_category = (c) => 
    {
         this.confirm.show(`Are you sure want to delete "${c.title}" ?`).then((opt) => {
            if (opt === false) return;  

        var target_url="/review/api/v1/question-categories/" + c.id;
        this.http.delete(target_url).subscribe((res)=>{
                    var cat_id='#cate_id_' + c.id ;
                    $(cat_id).remove();
                            }, (res)=>{
                                if(res.status != 422) return;                        
                                this.errors = res.json().errors;
                    });    

         });

    }
 // del category .......... 
  public  del_question = (q) => 
    {
        this.confirm.show(`Are you sure want to delete "${q.title}" ?`).then((opt) => {
            if (opt === false) return;  

        var target_url="/review/api/v1/question/" + q.id;
        this.http.delete(target_url).subscribe((res)=>{
                    var q_id='#question_id_' + q.id ;
                    $(q_id).remove();
                            }, (res)=>{
                                if(res.status != 422) return;                        
                                this.errors = res.json().errors; });    

         });    


    }

    ngAfterViewInit(){
        $("#category_form_inputs [name=status]").val('1');
        this.category.status=1; }


}// main class ........
