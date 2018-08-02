import { Component, Input, ViewChild,AfterViewInit } from '@angular/core';
import { Http } from "@angular/http"; 
import { ToastsManager } from "ng2-toastr";
import '../review/reviews/review-style.css';

@Component({
    selector: 'review_configuration',
    templateUrl: './review_configuration.html',
})
export class ReviewConfiguration {

    public btn: string = " Save Configurations ";
    public review_configurations: any = [];
    public settings:any=[];
    protected errors = {};

    constructor(protected http: Http,protected toastr: ToastsManager) {  }

    ngOnInit() { this.load_review_config(); }

    save_review_config() {
        this.btn='Processing...';
        var target_url = '/review/api/v1/configuration/update';
 
        this.http.post(target_url,{'details':this.settings}).subscribe((res) => {
            this.btn = " Save Configurations ";       
            //this.conf.config=res.json().data;
            this.toastr.success("Review settings saved successfully.");
        }, (res) => {
            if (res.status != 422) return;
            this.btn = " Save Configurations ";
            this.errors = res.json().errors;
        });
    }
    resetConfig(){
        this.http.get('/review/api/v1/configuration/reset').subscribe((res) => {
            this.load_review_config();
            this.toastr.success('Settings reset successfully.');
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });

    }

 freq_exist=(v,default_values)=>{ 
         var exist=false;
         if(typeof default_values!='undefined')
            {                
               default_values.forEach((dv,index) => {
                if(parseInt(v)==parseInt(dv) || v==dv )
                    exist=true;                
                    });

            }
        return exist;         
    }
 
    
    remove_value(id,val)
        {

            this.settings.forEach((value,index) => {
                if(value.id==id)
                    {
                        this.settings[index].value.forEach((v1,index1) => {
                            if(v1==val)
                                this.settings[index].value.splice(index1,1); 
                                                          
                            });// foreach for values..                                                                  
                    } // if ......                                   
                });// foreach for element ..  
 
            return ;
        }

    change_value=(input,id,values)=>{  
        var option=$(input).val()
        if($(input).is(":checked"))
            {                
                this.settings.forEach((value,index) => {
                if(value.id==id)
                    {
                        if(this.freq_exist(option,values)==false)
                           this.settings[index].value.push(option);                                               
                    } // if ......                                   
                });// foreach ..  
 
            }else
                this.remove_value(id,option);
        return;        
    }

   

    load_review_config() {
        
        this.http.get('/review/api/v1/configuration').subscribe((res) => {
            this.review_configurations = res.json().data;
            this.settings=this.review_configurations.details;
          
          /////////////////////////////////////

        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });
    }
}