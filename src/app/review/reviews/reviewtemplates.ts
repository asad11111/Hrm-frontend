import {Component, Input, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {ModalDirective} from 'ngx-bootstrap/modal';
import { AuthService } from "../../auth/auth.service";
import {Permission} from "../../auth/permission.service";
import { Confirm } from "../../shared/components/confirm";
import { Alert } from "../../shared/components/alert";
import { ToastsManager } from "ng2-toastr";

interface ReviewTemplate {
    title?:string;
    description?:string;
    status?:number;
}

@Component({
    selector   : 'reviews-templates',
    templateUrl: './reviewtemplates.html',
})
export class Reviewtemplates {

    @ViewChild('review_template_form') public review_template_form: ModalDirective;
    @ViewChild('confirmreviewer') confirm: Confirm;
    @ViewChild('alertpoup') alertpoup: Alert;
    public review_template:ReviewTemplate={status:1};
    public review_templates:any;
    public selected_review_template_id:number=0;
    public errors = {};
    public review_template_btn="Save template";

    constructor(public permission:Permission,protected http: Http){
        this.review_templates= {
                                "total":0,
                                "per_page":15,
                                "current_page":1,
                                "last_page":0,
                                "next_page_url":null,
                                "prev_page_url":null,
                                "from":null,
                                "to":null,
                                "data":[]};       
     }

ngOnInit() {


    this.load_review_templates();
    $('.dropdown-toggle').click(function(){
          var $elem=$(this).parent();
            if($elem.hasClass('open'))
                $elem.removeClass('open');
            else
                $elem.addClass('open');
         }); 
    }
    load_review_templates(){

        this.http.get('/review/api/v1/reviews-templates',{}).subscribe((res) => {
            this.review_templates=res.json() ;            
                    
                 }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;              
        });


    }
    open_review_template(edit=false){
        if(edit==false)
        {
            this.review_template={status:1};
            this.selected_review_template_id=0;
        }       
        this.review_template_form.show();
    } 
    save_review_template()
        {
            this.review_template_btn='Processing...';
            if(this.selected_review_template_id > 0)
                var target_url='/review/api/v1/reviews-templates/'+ this.selected_review_template_id +'/update';
               else
                var target_url='/review/api/v1/reviews-templates';

        this.http.post(target_url,this.review_template).subscribe((res) => {
           this.review_template_form.hide();  
           this.review_template_btn='Save template';
           this.load_review_templates();
        }, (res) => {
            if (res.status != 422) return;
            this.review_template_btn='Save template';
            this.errors = res.json().errors;
        });


        }

    edit_review_template(d)
        {
            this.review_template_btn='Update template';
            this.http.get('/review/api/v1/reviews-templates/'+d.id,{}).subscribe((res) => {
            this.review_template =res.json().data;            
            this.selected_review_template_id=res.json().data.id;
            this.open_review_template(true);
            this.review_template_btn='Save template';
                         }, (res) => {
                if (res.status != 422) return;
                this.review_template_btn='Save template';
                this.errors = res.json().errors;              
            });



        }

       // del category .......... 
  public  del_review_template = (c) => 
    {
         this.confirm.show(`Are you sure want to delete "${c.title}" ?`).then((opt) => {
            if (opt === false) return; 

            var target_url="/review/api/v1/reviews-templates/" + c.id;
            this.http.delete(target_url).subscribe((res)=>{
                    var cat_id='#review_template_' + c.id ;
                    $(cat_id).remove();
                            }, (res)=>{
                                if(res.status != 422) return;                        
                                this.errors = res.json().errors;
                    }); 
         });
      
    } //del_review_template
}
