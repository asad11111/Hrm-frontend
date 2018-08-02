import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Http } from "@angular/http";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { ToastsManager } from "ng2-toastr";

@Component({
    selector: 'add-designation',
    templateUrl: './add-designation.html',
})
export class AddDesignation {

    protected _designation;

    @Input()
    public set designation(val) {
        this._designation = val;
        this.errors = {};
    };
    public get designation() {
        return this._designation;
    }

    @Output()
    public onAdded = new EventEmitter();

    @Output()
    public onHide = new EventEmitter();

    public designations: any = [];

    public departments = [];

    public review_templates: any = [];

    public creating: boolean = false;

    protected errors: any = {};

    constructor(
        protected http: Http,
        protected auth: AuthService,
        protected router: Router,
        protected toastr: ToastsManager

    ) {
        this.errors = {};
    }
    ngOnInit() {
        // this.fetchDesignations();
        if(this.auth.hasModule("Review")==true)
            this.fetchReviewTemplates();
    }
    // fetchDepartments(){
    //     this.http.get('/core/api/v1/departments').subscribe((res) => {
    //         this.departments = res.json().data;
    //     });
    // }

    fetchReviewTemplates() {
        this.http.get(`/review/api/v1/reviews-templates`).subscribe((res) => {
            this.review_templates = res.json().data;
        });
    }

    fetchDesignations() {
        this.http.get(`/core/api/v1/designations`).subscribe((res) => {
            this.designations = res.json().data;
        });
    }

    save_template_designation(desig_id) {
        var obj = { status: 1, designation_id: desig_id, review_template_id: this.designation.review_template_id };
        var target = "/review/api/v1/designations/" + desig_id + "/reviews-templates";
        this.http.post(target, obj).subscribe((res) => { }, (res) => { });
    }

    save() {
        this.creating = true;
        this.http.post('/core/api/v1/designations', this.designation).subscribe((res) => {
            this.onAdded.emit(res.json().data);
            this.save_template_designation(res.json().data.id);
            this.toastr.success(`${this.designation.name} added`, 'Designation');
        }, (res) => {
            this.creating = false;
            if (res.status != 422) {
                return this.toastr.success(res.json().message, 'Designation');
            }
            this.errors = res.json().errors;
        }, () => {
            this.creating = false;
        });
    }
}
