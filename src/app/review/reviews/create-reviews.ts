import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Confirm } from "../../shared/components/confirm";
import { Alert } from "../../shared/components/alert";
import { ToastsManager } from "ng2-toastr";
import { ReviewConfig } from '../review-config';

interface Review {
    id?: number;
    company_id?: number;
    office_id?: number;
    title?: string;
    for_employee_id?: number;
    
    template_id?: number;
    description?: string;
    rating?: number;
    weighted_rating?: number;
    status?: number;
    review_session_id?: number;
    review_edit_count?: number;
    starting_date?: string;
    deadline?: string;
    end_date?: string;
    evaluation_type?: string;

    review_type?:number;
    frequency_id?: number;
    peers?: any;
    managers?: any;
}

interface TemplateDesignation{ 
    designation_id?:number,
    review_template_id?:number
}

@Component({
    selector: 'create-reviews',
    templateUrl: './create-reviews.html',
})
export class CreateReviews {

    @ViewChild('view_review_details') public view_review_details: ModalDirective;
    @ViewChild('select_employee_form') public select_employee_form: ModalDirective;
    @ViewChild('link_template_designation') public link_template_designation: ModalDirective;    
    @ViewChild('confirmreviewer') confirm: Confirm;
    @ViewChild('alertpoup') alertpoup: Alert;

    public tempdes:TemplateDesignation={};
    public review: Review = { status: 1, evaluation_type: "off",review_type:1 };
    public review_template: any = [];
    public review_types: any=[];
    public frequency_types:any=[];
    public selected_department_id: any = 0;
    public departments: any = [];
    public dep_employees: any = [];
    public dep_employees_more: any;
    public for_emp_template_id: number = 0;
    public selected_for_employee_id: number = 0;
    public current_employee_name: string = '';
    public selected_review_template: any = {};
    public saved_reviewers: Array<any> = [];
    public saved_temp_reviewers: Array<any> = [];
    public peer_employees: any = [];
    public managers_employees: any = [];
    public employee_cat_id: number = 1;
    public errors = {};
    public review_btn = " Save review ";
    public desig_based_template: any = [];
    public config:any;
    

    constructor(protected http: Http, protected toastr: ToastsManager,protected rconfig:ReviewConfig) {
        this.config=rconfig.config;   
     }

    ngOnInit() {

        this.load_desigBasedTemplates();
        this.reload_templates();

        this.http.get("/core/api/v1/departments").subscribe((res) => {
            this.departments = res.json().data;
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });

        if(typeof this.config=='object')
            {
                this.load_review_types();   
            }
        
        if(typeof this.config=='undefined')
            this.load_config();
    }

    employee_selected=(e)=>{
        var exist=false;
        this.saved_temp_reviewers.forEach((v,index)=>{
            if(v.id==e.id && (v.managers.length > 0 || v.peers.length >0 ) )
                exist=true;                
        });
        return exist;
    }
    check_peers_mngr = () => {
        var existpeers: number = 0
        this.saved_temp_reviewers.forEach((value, index) => {
            if (value.peers.length > 0)
                existpeers = 1;
            if (value.managers.length > 0)
                existpeers = 2;
        });

        if (existpeers > 0)
            return true;
        else
            return false;

    }


    save_linkTemplateDesignation(){
        var target="/review/api/v1/designations/"+ this.tempdes.designation_id +"/reviews-templates";
        this.http.post(target, this.tempdes ).subscribe((res) => {
            this.toastr.success('Saved successfully.') ;            
            this.reload_templates(1);
            this.link_template_designation.hide();
                       
        }, (res) => {
            if (res.status != 422) return;
            this.review_btn = 'Save review';
            this.errors = res.json().errors;
        });

    }


    linkTemplateDesignation=(e)=>{
        this.tempdes.designation_id=e.designation_id;
        this.link_template_designation.show();
        
    }

    select_review_template_default(id) {
        var templates = this.review_template;
        for (var i = 0; i < templates.length; i++) {
            if (id == templates[i].id)
                this.selected_review_template = templates[i];
        }

    }

    reload_templates(load_template=0) {
        this.http.get("/review/api/v1/reviews-templates").subscribe((res) => {
            this.review_template = res.json().data;
            if(load_template==1)
                this.load_employees( this.selected_department_id );
        }, (res) => {
            if (res.status != 422) return;
            this.review_btn = 'Save review';
            this.errors = res.json().errors;
        });
    }

    load_desigBasedTemplates() {

        this.http.get("/core/api/v1/designations?per_page=100").subscribe((res) => {
            this.desig_based_template = res.json().data;
        }, (res) => {
            if (res.status != 422) return;
            this.review_btn = 'Save review';
            this.errors = res.json().errors;
        });


    }

    load_config(){
        this.http.get('review/api/v1/config').subscribe((res)=>{
                this.config = res.json().data;                 
                this.load_review_types();                
            });
    }

    load_review_types() {
 
        var target="/review/api/v1/reviews-types?frequency=" + 
                this.config.review_frequency+"&review_type=" +this.config.review_type ;
        this.http.get(target).subscribe((res) => {
                          
            this.review_types = res.json().review_type;
            this.frequency_types= res.json().frequency ;         
            
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });
    }

    save_review(status = 1) {
  
        var review = this.review;
        var reviews = [];
        var selected_reviewer = this.saved_temp_reviewers;
        var http = this.http;
        var view_review_details = this.view_review_details;
        var toastr = this.toastr;

        selected_reviewer.forEach(function (value, index) {
            var r = {
                for_employee_id: value.id,
                department_id: value.department_id,
                parent_id:value.parent_id,
                template_id: review.template_id,
                status: 1,
                peers: [],
                managers: []
            };

            var peers = value.peers;
            var managers = value.managers;

            if (managers.length > 0 || peers.length > 0) {

                r.for_employee_id = value.id;
                var temp = [];
                for (var m = 0; m < managers.length; m++)
                    temp.push(managers[m].id);
                r.managers = temp;
                var temp = [];

                for (var m = 0; m < peers.length; m++)
                    temp.push({ id: peers[m].id, department_id: peers[m].department_id,parent_id:peers[m].parent_id });

                r.peers = temp;

                if (value.for_emp_template_id > 0)
                    r.template_id = value.for_emp_template_id;

                if (status > 1)
                    r.status = status;
                reviews.push(r);
            }

        });

        var send_data = {
            title: review.title,
            review_type: review.review_type,
            frequency_id:(review.review_type > 1 )?1:review.frequency_id,
            description: review.description,
            status:status,
            deadline: review.deadline,
            starting_date: review.starting_date,
            end_date: review.end_date,
            reviewee: reviews
        };

        if (reviews.length == 0)
            this.alertpoup.show(`Please choose employee for review and there peers and managers.`);
        else {

            this.review_btn = 'Processing...';
            var target_url = '/review/api/v1/reviews';
            http.post(target_url, send_data).subscribe((res) => {
                this.review_btn = 'Save review';
                toastr.success(`Review saved successfully.`, 'Review');
                view_review_details.hide();
            }, (res) => {
                if (res.status != 422) return;
                this.review_btn = 'Save review';
                var errors = res.json().errors
                var message = [];
                for (var i in errors) {
                    var temp = [];
                    if (errors[i].length > 0) {
                        temp = errors[i];
                        for (var k = 0; k < temp.length; k++)
                            this.toastr.error(temp[k], i);
                    }
                }
            });
        }
    } //save_review


    change_evaluation(input) {
        if ($(input).is(":checked") && $(input).val() == 'on')
            this.confirm.show(`Toggling 360 would reset the existing reviews you have selected .Are you sure you want to do this ?`).then((opt) => {
                if (opt === false) {
                    this.review.evaluation_type = 'off';
                    return; }                
                this.saved_temp_reviewers=[];
            });
    }

    loadEmployeesByDepartments(id) {
        var this_obj = this;

        if (typeof this.review.template_id == 'undefined' || this.review.template_id == 0) {
            this.toastr.error('Review template required before employee load.');
            return false;
        }

        var target_url = '/core/api/v1/departments/' + id + '/employees';
        this.selected_department_id = id;
        this.http.get(target_url).subscribe((res) => {
            var emps = res.json().data
            var desig = emps.designations;

            emps.employees.forEach(function (value, index) {
                value.designation = desig[value.designation_id].name;
                value.hastemplate = false;
                if (this_obj.check_for_desig_based_template(value) == false)
                    value.hastemplate = false;
                else
                    value.hastemplate = true;
                emps.employees[index] = value;
            });

            this.dep_employees = emps.employees;
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });
    } // ****** loadEmployeesByDepartments

    load_employees(id) {
        var this_obj = this;        
        this.loadEmployeesByDepartments(id);
    }//load_employees

    load_employees_more(id = 0) {
        var target_url = '/core/api/v1/departments/' + id + '/employees';
        this.selected_department_id = id;
        this.http.get(target_url).subscribe((res) => {

            var emps = res.json().data;
            var desig = emps.designations;
            emps.employees.forEach(function (value, index) {
                value.designation = desig[value.designation_id].name;
                emps.employees[index] = value;
            });
            this.dep_employees_more = emps.employees;

        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });

    }//load_employees

    select_peers = (peer) => {
        this.save_add_employee(peer, 2);
        if(this.review.evaluation_type=='on')
            this.select_360_evaluation(peer,2);
    }

    select_mngr = (manager) => {
        this.save_add_employee(manager, 3);
        if(this.review.evaluation_type=='on')
            this.select_360_evaluation(manager,3);
    }


    select_360_evaluation=(e,type)=>{ 
        this.addReviewee(e);
        this.save_add_employee(this.current_employee_name,2,e.id); 
    }





    check_for_desig_based_template = (employee) => {
        var templates = this.review_template;
        var des_id = employee.designation_id;
        var sel_template: any = false;

        templates.forEach((value, index) => {
            var designations = value.designations;
            for (var i = 0; i < designations.length; i++)
                if (designations[i] == des_id)
                    sel_template = value;
        });

        return sel_template;
    }

    load_manager_peers = (e_input, employee,option=1) => {
        var emp = $(e_input);
        var id = $(".department_id_sel").val();
    
        var dasig_based_template = this.check_for_desig_based_template(employee);
        if (this.review.template_id == 9999999 && dasig_based_template == false) {
            emp.prop("checked", false);
            this.toastr.error(`Please select Review template for designation ${employee.designation}`);
            return false;
        }

        if (emp.is(':checked') || option==2) {
            if (typeof employee.peers == 'undefined')
                employee.peers = [];
            if (typeof employee.managers == 'undefined')
                employee.managers = [];

            this.selected_for_employee_id = employee.id;
            this.current_employee_name = employee;             

            var saved_temp_reviewers = this.saved_temp_reviewers;
            this.for_emp_template_id = 0;

            this.addReviewee(employee);// add new revieweee.........          

            var target_url = '/core/api/v1/departments/' + id + '/employees';
            this.selected_department_id = id;
            
            this.http.get(target_url).subscribe((res) => {

                var emps = res.json().data;
                var desig = emps.designations;
                emps.employees.forEach(function (value, index) {
                    value.designation = desig[value.designation_id].name;
                    emps.employees[index] = value;
                });
                this.peer_employees = emps.employees;

            }, (res) => {
                if (res.status != 422) return;
                this.errors = res.json().errors;
            });

            var target_url = '/core/api/v1/employees/' + employee.id + '/manager';
            this.http.get(target_url).subscribe((res) => {
                var data = res.json().data;

                if (data.manager.id > 0) {
                    var emps = data.manager;
                    emps.designation = data.designation.name;
                    this.managers_employees = [emps];
                    /*
                    Multi evaluation data........
                    if (this.review.evaluation_type == 'on') {
                        this.save_add_employee(emps, 3, employee.id);
                    }
                    */
                }
                else
                    this.managers_employees = [];
            }, (res) => {
                if (res.status != 422) return;
                this.errors = res.json().errors;
            });

        }

    }

    show_ad_more_employee(type) {
        this.employee_cat_id = type;
        this.select_employee_form.show();
    }
    // 1 employee
    // 2 peers
    // 3 managers
    check_existemp(ext_arr, id) {
        var emp_exist = false;
        for (var n = 0; n < ext_arr.length; n++) {
            if (ext_arr[n].id == id)
                emp_exist = true;
        }
        return emp_exist;
    }
    check_exist_peers_mngr = (type, id) => {
        var status = false;
        var saved_temp_reviewers = this.saved_temp_reviewers;
        var emp_id = this.selected_for_employee_id;
        saved_temp_reviewers.forEach(function (value, index) {
            if (value.id == emp_id) {
                switch (type) {
                    case 2:
                        var peers = value.peers;
                        for (var i = 0; i < peers.length; i++)
                            if (peers[i].id == id)
                                status = true;
                        break;
                    case 3:
                        var managers = value.managers;
                        for (var i = 0; i < managers.length; i++)
                            if (managers[i].id == id)
                                status = true;
                        break;
                }
            }
        });
        return status;
    }

    save_more_reviewer = (emp) => {
        var saved_temp_reviewers = this.saved_temp_reviewers;
        switch (this.employee_cat_id) {
            case 3:
                if (this.check_existemp(this.managers_employees, emp.id) == false)
                    this.managers_employees.push(emp);
                this.save_add_employee(emp, 3);
                break;
            case 2:
                if (this.check_existemp(this.peer_employees, emp.id) == false)
                    this.peer_employees.push(emp);
                this.save_add_employee(emp, 2);
                break;
        }

    }

    remove_reviewer = (employee, reviewer, type) => {

        this.confirm.show(`Are you sure you want to remove "${reviewer.first_name}  ${reviewer.last_name}" `).then((opt) => {
            if (opt === false) return;
            var reviewers_list = this.saved_temp_reviewers;
            switch (type) {
                case 1:
                    for (var k = 0; k < reviewers_list.length; k++)
                        if (reviewers_list[k].id == employee.id)
                            reviewers_list.splice(k, 1);
                    break;
                case 3:
                    reviewers_list.forEach(function (value, index) {
                        if (value.id == employee.id) {
                            var managers = reviewers_list[index].managers;
                            for (var k = 0; k < managers.length; k++) {
                                if (managers[k].id == reviewer.id)
                                    managers.splice(k, 1);
                            }
                        }
                    });
                    break;
                case 2:
                    reviewers_list.forEach(function (value, index) {
                        if (value.id == employee.id) {
                            var peers = reviewers_list[index].peers;
                            for (var k = 0; k < peers.length; k++) {
                                if (peers[k].id == reviewer.id)
                                    peers.splice(k, 1);
                            }
                        }
                    });
                    break;
            } // switch ...

        });

    }

 
    select_all_emp = (type) => {

        var all_peers = this.peer_employees;
        var all_managers = this.managers_employees;
        switch (type) {
            case 2:
                for (var i = 0; i < all_peers.length; i++)
                    this.save_add_employee(all_peers[i], 2);
                break;
            case 3:
                for (var i = 0; i < all_managers.length; i++)
                    this.save_add_employee(all_managers[i], 3);
                break;
        }
    }

    select_review_template(target_value) {
        var current_emp_id = this.selected_for_employee_id;
        var current_template_id = $(target_value).val();
        var selected_reviewee = this.saved_temp_reviewers;
        var templates = this.review_template;

        selected_reviewee.forEach(function (value, index) {
            if (selected_reviewee[index].id == current_emp_id) {
                if (current_template_id == 0) {
                    selected_reviewee[index].for_emp_template_id = current_template_id;
                    selected_reviewee[index].review_template = {};
                } else
                    for (var i = 0; i < templates.length; i++) {
                        if (templates[i].id == current_template_id) {
                            selected_reviewee[index].for_emp_template_id = current_template_id;
                            selected_reviewee[index].review_template = templates[i];
                        }
                    }
            }
        });
        this.saved_temp_reviewers = selected_reviewee;
        return true;
    }

    addReviewee(e){

        var reviewee=this.saved_temp_reviewers;
        var dasig_based_template = this.check_for_desig_based_template(e);
        if (this.review.template_id == 9999999 && dasig_based_template == false) {           
            this.toastr.error(`Please select Review template for designation ${e.designation}`);
            return false;
        }

        if( this.check_existemp(reviewee,e.id)==false)
            {
                if (typeof e.peers == 'undefined')
                    e.peers = [];
                if (typeof e.managers == 'undefined')
                    e.managers = [];
                              
                if (this.review.template_id == 9999999 && dasig_based_template != false) {
                    e.for_emp_template_id = dasig_based_template.id;
                    e.review_template = dasig_based_template;
                } else {
                    e.for_emp_template_id = this.selected_review_template.id;
                    e.review_template = this.selected_review_template;
                }
                reviewee.push(e);
            }
        return true;
    }
    save_add_employee = (employee, type, e_id = 0) => {
        var saved_temp_reviewers = this.saved_temp_reviewers;
        var emp_id = (e_id == 0) ? this.selected_for_employee_id : e_id;
        var this_obj = this;
        switch (type) {
            case 1:// add employee for review

                break;
            case 2:// add employee for peers
                saved_temp_reviewers.forEach(function (value, index) {
                    if (value.id == emp_id) {
                        if (this_obj.check_existemp(value.peers, employee.id) == false)
                            saved_temp_reviewers[index].peers.push(employee);
                    }
                });
                break;
            case 3:// add employee for managers
                saved_temp_reviewers.forEach(function (value, index) {
                    if (value.id == emp_id) {
                        if (this_obj.check_existemp(value.managers, employee.id) == false)
                            saved_temp_reviewers[index].managers.push(employee);
                    }
                });
                break;
        }

    }

}
