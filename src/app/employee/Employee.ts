export class Employee {

    public id:number;

    public first_name: string;

    public last_name:string;

    public father_name:string;

    public contact_number:string;

    public date_of_joining:string;

    public date_of_birth:string;

    public contact:string;

    public designation_id: number;

    public department_id: number;

    public office_id:number;

    public user_id:number;

    public parent_id:number;

    public image_id:number;

    public role_id:number;

    public image:Blob;

    public address:{
        country?:string,
        city?:string,
        state?:string,
        street?:string,
        zip?:string
    };

    public gender:string;

    constructor(){
        this.address = {};
    }

}
export class Role {

    public id;

    public name;

}

export class User {

    public id;

    public email;

    public role_id;

    public password;

    public password_confirmation;
}

export class Payroll {
    public work_day_in_week = 5;

    public employee_kiwisaver_contribution = 4;

    public employee_ird = '0';

    public emplyee_tax_code = 'M';

    public child_support = '0';

    public student_loan = 12;

    public work_hours_in_day = 8;

    public employee_salary = '0';

    public pay_rate_type = 'Hourly';

    public ministry_of_fine = '0';
    public moj_deduction_from = '';
    public remaining_moj = '0';
    public moj_deduction_per_pay = '0';
    public ppn_number = '';

    public employee_type = 1;
    public casual_emp_leaves_paid_every_pay = 1;

    public use_emp_leaves = '0';
    public sick_leaves = '0';
    public annual_leaves = '0';
    public bareavement_leaves = '0';
}