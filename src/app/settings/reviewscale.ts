import { Component, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { AuthService } from "../auth/auth.service";

import { Confirm } from "../shared/components/confirm";
import { Alert } from "../shared/components/alert";
import { ToastsManager } from "ng2-toastr";

@Component({
    selector: 'review-scale',
    templateUrl: './reviewscale.html',
})

export class ReviewScale {

    public scalings:any = [];
    public scales:any = [];
    public scale_type: string = 'range';
    public label: string = '';
    public minimum_value: Number = 0;
    public maximum_value: number = 0;
    public scale_value: number = 0;

    @ViewChild('confirmreviewer') confirm: Confirm;
    @ViewChild('alertpoup') alertpoup: Alert;

    constructor(
        protected http: Http,
        protected auth: AuthService,
        protected toastr: ToastsManager
    ) { }
    ngOnInit() {
        this.load_scales();
    }

    remove_scale = (s,action=0) => {
 
        this.confirm.show(`Are you sure you want to remove ?`).then((opt) => {
            if (opt === false) return;

            switch(action){
                case 0:
                this.scalings.forEach((value, index) => {
                        if (s.value == value.value && s.label == value.label)
                            this.scalings.splice(index, 1);
                    });

                break;
                case 1:
                    var target="/review/api/v1/reviews-scales/"+s.id;
                    this.http.delete(target).subscribe((res) => {
                        this.load_scales();                                          
                    }, (res) => {
                        if (res.status != 422) return;
                    });


                break;
            }


            
        });
    }
    reset_form = (type = 0) => {
        this.minimum_value = 0;
        this.label = "";
        this.scale_value = 0;
        this.maximum_value = 0;
    }
    add_scaling = () => {
        var exist = 0
        var scale = {
            label: this.label,
            value: this.scale_value,
        };

        this.scalings.forEach((value, index) => {
            if (scale.value == value.value)
                exist = 1;
        });
        if (exist == 1)
            this.toastr.error("Value already exist.");
        
        if(this.scalings.length > 0 && exist==0)
            this.scalings.push(scale);

        if (this.scalings.length == 0)
            this.scalings.push(scale);
    };

    load_scales(){    
        this.http.get("/review/api/v1/reviews-scales").subscribe((res) => {
            this.scales =res.json().data;
        }, (res) => {
            if (res.status != 422) return;
        });
    }

    save_scaling = () => {

        var obj = {};

        switch (this.scale_type) {
            case 'range':
                obj = {
                    type: this.scale_type,
                    default: 1,
                    scale_content: {
                        prefix: this.label,
                        min: this.minimum_value,
                        max: this.maximum_value,
                    }
                };
                break;
            case 'custome':
                
                obj = {
                    type: this.scale_type,
                    default: 1,
                    scale_content: this.scalings
                };
                break;
        }

        this.http.post("/review/api/v1/reviews-scales", obj).subscribe((res) => {
            this.toastr.success('Scale saved successfully.');
            this.load_scales();
            this.scalings=[];
        }, (res) => {
            if (res.status != 422) return;
        });
    }



}

