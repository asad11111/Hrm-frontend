import {Component, Input,ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {Router,ActivatedRoute} from  "@angular/router"; 
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ReviewConfig} from '../review-config';


import { Confirm } from "../../shared/components/confirm";
import { Alert } from "../../shared/components/alert";
import { ToastsManager } from "ng2-toastr";


interface ReviewTemplate {
    id?:number;
    title?:string;
    description?:string;
    status?:any;
    self_weight?:number;
    dr_weight?:number;
    peer_weight?:number;
    template_type?:number;
    manager_weight?:number;
}

interface Category {
    id?:number;
    title?:string;
    description?:string;
    status?:boolean;
}


interface Question {
    id?:number;
    title?:string;
    description?:string;
    category_id?:number;
    status?:boolean;
    sorting?:number;
    template_id?:number;
}

@Component({
    selector   : 'questions-weights',
    templateUrl: './questions-weights.html',
})
export class QuestionsWeights {

    @ViewChild('question_form') public question_form: ModalDirective;
    @ViewChild('confirmreviewer') confirm: Confirm;
    @ViewChild('alertpoup') alertpoup: Alert;
    
    public review_template:ReviewTemplate={
                                            template_type:1,
                                            manager_weight:1,
                                            dr_weight:1,
                                            peer_weight:1,
                                            self_weight:1,
                                        };
    public template_questions:any;
    public sub_questions:any;
    public categories:any;
    public category:Category={};
    public question:Question={};

    public scaling_type:string='';
    public total_question_percentage:number=100;
    public percentage_calculation:number=0;

    public selected_review_template_id:number=0;
    public errors:any = {};
    public review_template_btn=" Save weight ";
    public question_btn:string=" Save question ";
    public questions_unselected:any;
    public configurations:any;

    public categories_questions_by_template:any=[];

    constructor(protected http: Http,private activatedRoute: ActivatedRoute,protected toastr:ToastsManager, public rconfig:ReviewConfig){

       this.configurations=rconfig.config; 
       if(this.configurations.weighted_reviews=='0' || this.configurations.weighted_reviews==0 )   
            this.review_template.template_type=1;
        
        this.categories={       "total":0,"per_page":15,"current_page":1,
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
                        this.review_template.manager_weight=this.review_template.manager_weight?this.review_template.manager_weight:1;
                        this.review_template.dr_weight=this.review_template.dr_weight?this.review_template.dr_weight:1;
                        this.review_template.peer_weight=this.review_template.peer_weight?this.review_template.peer_weight:1;
                        this.review_template.self_weight=this.review_template.self_weight?this.review_template.self_weight:1;
                        this.review_template.template_type=this.review_template.template_type?this.review_template.template_type:1;
                        
                        switch(this.review_template.template_type )
                            {
                                case 2:
                                    this.set_scaling_type('times');
                                    $('.info-sticky-box').addClass('hide');
                                break;
                                case 3:
                                    this.set_scaling_type('%');                                     
                                    $('.info-sticky-box').removeClass('hide');
                                break;
                                default :
                                    $('.info-sticky-box').addClass('hide');
                                break;
                            }
                        this.load_category_byTemplate( this.selected_review_template_id ) ;    
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;
                    });
                    } 
                });
     }

    load_category_byTemplate(id)
        {
            var target="/review/api/v1/reviews-templates/"+id+"/question-categories/question";
             this.http.get(target,{}).subscribe((resp)=>{
                        this.categories_questions_by_template=resp.json().data;                                                                
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;
                    });
        } 

    ngOnInit(){
        var $this= this;       
        $(document).on('change',".categorieslist .weightage",function(){
            var value:any = $(this).val();
            if( parseFloat(value) == 0 || parseFloat(value) < 0 )
                {
                    $this.toastr.error("Value should be greater then zero.");
                    $(this).val(1);
                }
             
        });

    } 
    public set_scaling_type = (d) =>
        {
            this.scaling_type=d; 
            switch(d)
                {
                    case '%':
                        $('.info-sticky-box').removeClass('hide');
                        this.calculate_percentage();
                    break;
                    default :
                        $('.info-sticky-box').addClass('hide');
                        this.total_question_percentage=0;
                        var all_inputs=$(".question_weights .weightage");
                         $.each( all_inputs,( key, obj )=> { 
                                $(obj).val(1);
                            }); 
                    break;
               }
        }

/*
    public load_questions = (d) =>
        {
            var name=".loader_" + d.id;
            $(name).removeClass('hide');
             this.http.get('/review/api/v1/question-categories/'+d.id+'/questions?selected=1&template_id='+ this.selected_review_template_id ,{}).subscribe((res)=>{
                
                 var temp=this.template_questions;
                 if(typeof temp=="undefined")
                   this.template_questions={['obj_'+d.id]:res.json() }; 
                    else
                        {
                            temp['obj_'+d.id]=res.json();
                            this.template_questions=temp;     
                        }                      
                     this.sub_questions=res.json(); 
                     $(name).addClass('hide');                     
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;
                        $(name).addClass('hide');
                    });
            return true;
        }

        */

    public question_check = (q) =>
        {
            if(typeof this.template_questions=='undefined')
                return false;
            if(typeof this.template_questions['obj_'+q.id]=='undefined')
                return false;
             if(this.template_questions['obj_'+q.id].total==0)
                return false;
                return true;      
        }

/*

    load_question_categories()
        {
           if(this.selected_review_template_id>0)
             var target="/review/api/v1/reviews-templates/"+this.selected_review_template_id+"/categories?selected=1";
           else
             var target="/review/api/v1/question-categories";
         
           this.http.get(target,{}).subscribe((data)=>{
                        this.categories =data.json();  

                        for(var i=0;i<this.categories.data.length;i++ )
                            this.load_questions(this.categories.data[i]); 

                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;
                    });
        }
    */
   save_questions_weightage()
        {
           var weights=$('.question_weights .weightage');
           var all_question_weightages={} ;

          if(this.review_template.template_type==3 && this.total_question_percentage!=100)
            {
                 this.toastr.error("Percentage weightage must be equal to 100%");
                 return false;
            }  
         

           $.each( weights,( key, value )=> {
             var question_id=$(value).attr('question-id');
             all_question_weightages['obj_'+question_id]={
                                            template_id:this.selected_review_template_id,
                                            question_id:$(value).attr('question-id'),
                                            weight:$(value).val(),
                                            status:1
                                         };                                         
                    });         
            this.review_template_btn='Processing...';
            var target="/review/api/v1/reviews-templates/save_weightage_array";
                this.http.post(target,all_question_weightages).subscribe((data)=>{        
                 },(res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;
                    });

             var target="/review/api/v1/reviews-templates/"+ this.selected_review_template_id+"/weightage" ;
             this.http.post(target,this.review_template).subscribe((data)=>{ 
                this.review_template_btn=' Save weight';
                this.toastr.success("Questions weight saved successfully.");
             },
                 (res)=>{this.review_template_btn=' Save weight';
                        if(res.status != 422) return;
                            this.errors = res.json().errors;
                    });
        } 

    public remove_question=(question,cat)=>
        {
            this.confirm.show(`Are you sure want to delete "${question.title}" ?`).then((opt) => {
                        if (opt === false) return; 
                                              
            var target_url="/review/api/v1/reviews-templates/"+ this.selected_review_template_id +"/question/" + question.id;
            this.http.delete(target_url).subscribe((res)=>{
                        var row_id="#item_" + question.id;
                        this.categories_questions_by_template.forEach(( value,index )=>{                            
                            if(cat.id==value.id)
                            {
                                for(var i in value.questions)
                                {
                                    if(question.id==value.questions[i].id)
                                        this.categories_questions_by_template[index].questions.splice(i,1);
                                    if(value.questions.length==0)  
                                        this.categories_questions_by_template.splice(index,1);  
                                }
                            }
                        });
                       //  $(row_id).remove();
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;
                    }); 
            });
        
        } 


     public calculate_percentage=(selected=0)=>
        {
             this.percentage_calculation=selected;
             this.total_question_percentage=0;
             var all_inputs=$(".question_weights .weightage");
             var total_questions:number =all_inputs.length;
             var per_question_value= Math.round((100/total_questions));

             $.each( all_inputs,( key, obj )=> { 

                 if(this.percentage_calculation==0)
                    {
                         if(key==(total_questions-1))
                            {
                                var last_input=100-this.total_question_percentage;
                                $(obj).val(last_input);
                            }
                            else
                                $(obj).val(per_question_value);
                    }                

                    let val:any = $(obj).val();
                this.total_question_percentage= this.total_question_percentage + parseInt(val);
            }); 
        } 

    public add_questions(){    
         this.http.get('/review/api/v1/reviews-templates/'+this.selected_review_template_id+'/questions/unselected' ,{}).subscribe((res)=>{
                     this.questions_unselected=res.json().data;
                     this.question_form.show();                           
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;                       
                    });        
    }

  public  save_question=(id)=>
  {
      var target="/review/api/v1/reviews-templates/"+ this.selected_review_template_id +"/question/" + id;
      this.http.post(target,{status:1}).subscribe((res)=>{
                   this.load_category_byTemplate(this.selected_review_template_id);
                   $("#question_"+id).remove();                                               
                    }, (res)=>{
                        if(res.status != 422) return;
                        this.errors = res.json().errors;                       
                    }); 
  }

  public change_allvalues=(element)=>
        {
            var value_score=$(element).val();
            if(value_score==0 || value_score < 0)
            {
                this.toastr.error('Value should be greater the zero.');
                $(element).val(1);
                return;
            }
            var id =$(element).attr('id') ;
            var elements=".categorieslist .w_category_" + id;
            $(elements).val(value_score);
            if(this.review_template.template_type==3)
                this.calculate_percentage(1);
        }
 

}
