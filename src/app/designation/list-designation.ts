import {Component, Input, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {Permission} from "../auth/permission.service";
import {clone} from "../shared/helpers";
import {ToastsManager} from "ng2-toastr";
import {Confirm} from "../shared/components/confirm";
import {Alert} from "../shared/components/alert";
import {AuthService} from "../auth/auth.service";

@Component({
    selector   : 'list-designation',
    templateUrl: './list-designation.html',
})
export class ListDesignation {

    errors = {};

    designations = [];

    addDesignation:any;

    editDesignation:any;
 
    @ViewChild('alert')
    alert:Alert;

    @ViewChild('confirm')
    confirm:Confirm;

    public fetching: boolean;

    public fetched: boolean;

    public failed: boolean;

    constructor(
        protected http: Http,
        public permission:Permission,
        protected toastr:ToastsManager,
        public auth:AuthService
    ) {}

    get_template_name=(templates,id)=>{
        var name='';
        if(templates.length > 0)
        for(var i=0;i<templates.length;i++)
           if(templates[i].designation_id==id)
               name=templates[i].title;  

        return name;
    }
    ngOnInit() {
        this.fetchDesignations();
    }
    fetchDesignations(){
        this.fetching = true;
        this.http.get('/core/api/v1/designations').subscribe((res)=>{
            this.fetched = true;
            this.fetching = false;
            this.designations = res.json().data;
            if(this.auth.hasModule("Review")==true){
                this.fetchReviewtemplat();
            }
        },()=>{
            this.fetching = false;
            this.failed = true;
        });
    }
    fetchReviewtemplat(){
        var desig_ids=[];
        this.designations.forEach((value,index)=>{ desig_ids.push(value.id); });
        this.http.post(`/review/api/v1/designations/review-templates-ids`,{ids:desig_ids}).subscribe((res)=>{
            var review_templates_att=res.json().data;
            this.designations.forEach((value,index)=>{
                this.designations[index].template_name =this.get_template_name(review_templates_att,value.id);
            })

        }) ;

    }
    edit(designation){
        if(designation.name == 'CEO'){
            return this.alert.show(`
                CEO designation can not be edited.
            `);
        }
       
        designation.review_template_id=0;

        this.http.get(`/review/api/v1/designations/${designation.id}/review-template`).subscribe((res)=>{
            var obj = res.json().data;

            if(typeof obj.review_template_id!="undefined")
               designation.review_template_id=obj.review_template_id;        
        
            this.editDesignation =  clone(designation);
        },(res)=>{
            this.editDesignation =  clone(designation);
        })

        
    }
    added(designation){
        this.addDesignation = null;
        this.designations.unshift(designation);
        //this.fetchReviewtemplat();
    }
    updated(designation){
        this.editDesignation = null;
        var index = this.designations.findIndex((d)=>{
            return d.id == designation.id;
        });
        Object.assign(this.designations[index], designation);
        //this.fetchReviewtemplat();
    }
    destroy(designation){
        if(designation.name == 'CEO'){
            return this.alert.show('CEO designation can not be deleted.');
        }
        if (designation.number_of_employees > 0) {
            return this.alert.show(`
                You have employees with this designation. 
                Please assign them another designation before deleting.`
            );
        }
        this.confirm.show(`Are you sure you want to delete '${designation.name}'?`).then((opt)=>{
            if(opt == false) return;
            this.http.delete(`/core/api/v1/designations/${designation.id}`).subscribe((res)=>{
                this.removed(designation);
            });
        });
    }
    removed(designation){
        var index = this.designations.findIndex((d)=>{
            return d.id == designation.id;
        });
        this.designations.splice(index, 1);
        this.toastr.success(`${designation.name} removed`, 'Designation');
    }
}
