import {Component, Input,ViewChild} from '@angular/core';
import { Http } from "@angular/http"; 
import { ToastsManager } from "ng2-toastr";
import {Router, ActivatedRoute} from  "@angular/router";
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Confirm } from "../../shared/components/confirm";
import { Alert } from "../../shared/components/alert";


@Component({
    selector: 'email_templates',
    templateUrl: './email_templates.html',
})
export class EmailTemplates {

    @ViewChild('create_template_form') public create_template_form: ModalDirective;

    @ViewChild('confirmreviewer') public confirm: Confirm;
    
    public btn: string = " Save Email Template ";
    
    public email_templates:any=[];

    public sel_template_id:any =0;

    public emaiTemplate:any={
                              template_format:"",
                              title:"",
                              status:1,
                              module_id:1
                            };

    public errors = {};

    constructor(protected http: Http,protected toastr: ToastsManager) {  }

    ngOnInit() { 
                this.loadTemplates();  
    }
 
openPopup(){
    this.create_template_form.show();
}
    saveEmailTemplate() {
        this.btn='Processing...';
        if(this.sel_template_id > 0)
            var target_url = `/core/api/v1/email/templates/${this.sel_template_id}`;
        else
            var target_url = '/core/api/v1/email/templates';
 
        this.http.post(target_url,this.emaiTemplate).subscribe((res) => {
            this.btn = " Save Email Template ";       
            this.loadTemplates();
            this.create_template_form.hide();
            this.sel_template_id=0;
            this.toastr.success("Email template saved successfully.");
        }, (res) => {
            if (res.status != 422) return;
            this.sel_template_id=0;
            this.btn = " Save Email Template ";    
            this.errors = res.json().errors;
        });
    }

 edit=(d)=>
    {
        this.emaiTemplate=d;
        this.sel_template_id=d.id;
        this.create_template_form.show();
    }   
  

  del=(d)=>{
      this.confirm.show(`Are you sure want to delete "${d.title}" ?`).then((opt) => {
                        if (opt === false) return; 
         this.http.delete(`/core/api/v1/email/templates/${d.id}`).subscribe((res)=>{
             this.toastr.success(`"${d.title}" deleted successfully  ?`);
             this.loadTemplates();
         },(res)=>{
             this.errors=res.json();
         }) ; 
      });
  }

    loadTemplates() {
        
        this.http.get('/core/api/v1/email/templates').subscribe((res) => {
            this.email_templates = res.json().data;           
          /////////////////////////////////////
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });
    }
}