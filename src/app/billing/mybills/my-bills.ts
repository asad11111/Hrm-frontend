import {Component, Input,ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {Router, ActivatedRoute} from  "@angular/router";
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Permission} from "../../auth/permission.service";
import { Confirm } from "../../shared/components/confirm";
import { Alert } from "../../shared/components/alert";
import { ToastsManager } from "ng2-toastr";
import * as moment from 'moment';

interface Payment { 
    exp_year?:string , 
    exp_month?:string , 
    card_number?:number, 
    amount?:number;
    payment_type?:string;
    cvc?:number;
}

 
@Component({
    selector   : 'mybills',
    templateUrl: './my-bills.html',
})
export class MyBills {

    @ViewChild('payment_form') public payment_form: ModalDirective; 
    @ViewChild('confirmreviewer') confirm: Confirm;
    @ViewChild('alertpoup') alertpoup: Alert;
    
    public packages:any=[];
    public paymentHistory:any=[];
    public modules:any=[];
    public payment:Payment={};    
    public currentPackageID=0;
    public errors = {};
    public save_package_btn="fa-save"; 
    public months:any=["01",'02','03','04','05','06','07','08','09','10','11','12'];
    public refresh_bill:boolean=false;
    public aleady_package_subscribed=false;

    constructor(
     public permission:Permission,
     protected http: Http,
     private activatedRoute: ActivatedRoute,
     protected toastr:ToastsManager ){        
         this.payment.payment_type="monthly";
         this.payment.exp_month='01';
     }

    ngOnInit(){
       this.loadModules(); 
       this.loadPackages();    
       this.loadPaymentHistory();   
      } 
   
    getModuleName=(d)=>{         
        var modules= this.modules.data;
        var curModules = d.modules; 
        var module_name='\n';
        var selected_mod=parseInt(curModules.length) - 1;
 
          modules.forEach((v,i)=>{
            curModules.forEach((val,index)=>{              
                if( val.module_id == v.id && index < selected_mod )
                    module_name+= ' , ' ;
                 if( val.module_id == v.id )
                    module_name+=v.name  ;    
            });               
        }); 
        return module_name;
    }  

    loadModules(){
        this.http.get('/core/api/v1/admin/modules').subscribe((res) => {
            this.modules = res.json(); 
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;            
        });
    }

    loadPackages(page_id=1){
        var target='/billing/api/v1/packages?myPackage=own';
        this.http.get(target).subscribe((res) => {
            this.packages = res.json(); 
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;            
        });
    }

    dateFormate=(d,f)=>{
        var Date=moment(d);
        return Date.format(f);
    }

    loadPaymentHistory(){
        var target='/billing/api/v1/bill/own';
        this.http.get(target).subscribe((res) => {
            this.paymentHistory = res.json().data;
        }, (res) => {
            this.refresh_bill=true; 
            if (res.status != 422) return;
            this.errors = res.json().errors;   
        });
    }
     
    alert_errors(errors)
        {
            for(var i in errors)
                 {  var e=errors[i];
                    this.toastr.error(e);
                 }   
        }

    addPackage(d)
        {
            var target=  `/billing/api/v1/packages/${d.id}/user`;
            this.confirm.show(`Are you sure want to subscribe ${d.title} Package worth ${d.amount}$ / ${d.paymentcycle}  ?`).then((opt) => {
                    if (opt === false) return;
                     this.http.get(target).subscribe((res)=>{
                            this.toastr.success(`Package ${d.title} subscribed successfully.`);
                            this.loadPackages();
                            this.loadPaymentHistory();
                        },(res)=>{
                            if (res.status != 422) return;
                            this.errors = res.json().errors;
                            this.alert_errors( this.errors );
                        });
              });           
        }            

    removePackage(d)
        {
            var target=  `/billing/api/v1/packages/${d.id}/unsbscribe`;
            this.confirm.show(`Are you sure want to unsubscribe "${d.title}" package ?`).then((opt) => {
                    if (opt === false) return;
                     this.http.delete(target).subscribe((res)=>{
                            this.toastr.success(`Package ${d.title} unsubscribed successfully.`);
                            this.loadPackages();
                            this.loadPaymentHistory();
                        },(res)=>{
                            if (res.status != 422) return;
                            this.errors = res.json().errors;
                            this.loadPaymentHistory();
                            this.alert_errors(this.errors);    
                        });
              });           
        }            

    payNow()
        {             
          var target=  '/billing/api/v1/payment/stripe/userprocess';
          this.save_package_btn="fa-spinner fa-pulse fa-fw";
          this.http.post(target,this.payment ).subscribe((res) => {
                this.loadPaymentHistory();              
                this.toastr.success("Payments are processed successfully.");
                this.payment_form.hide();
            }, (res) => {
                this.save_package_btn="fa-save";
                if (res.status != 422) return;
                this.errors = res.json().errors;                       
            });            

        }   
 


}// main class ........
