import { Component, OnInit,Input } from '@angular/core';

@Component({
    selector: 'top-performers',
    templateUrl: './top-performers.html'
})
export class TopPerformers implements OnInit {

    @Input() public performData;

    public maxRating:number=0;

    constructor() { }

    ngOnInit() { 
        
    }

    getName=(d,data)=>{
        var employees=data.employees;
        var empName="";
        employees.forEach((v,i)=>{
            if(v.id==d.for_employee_id)
               {
                   empName=v.first_name + " " + v.last_name; 
                   //console.log(v);
               } 
        });
        return empName;
    }

    loadList=(data)=>{
       
        if(typeof data!='undefined')
            return data.reviews; 
          else
            return [];
    }


    createStar=(d,lim)=>{
        var ratings= d.totalrating/d.num_reviews ;
        var actual= ( ratings / this.maxRating ) * 100;
        var classes="";
        switch(lim)
            {
                case 25:
                    if(actual < 25)
                        classes = "-o";
                     if(actual > 0 && actual < 25 )   
                        classes = "-half";
                break;
                case 50:
                    if(actual < 50)
                        classes = "-o";
                     if(actual < 50 && actual > 25 )   
                        classes = "-half";
                break;                    
                case 75:
                    
                    if(actual < 75)
                        classes = "-o";
                     if(actual < 75 && actual > 50 )   
                        classes = "-half";

                break;
                case 100:

                    if(actual < 100)
                        classes = "-o";
                     if(actual < 100 && actual > 75 )   
                        classes = "-half";

                break;
            }          

        return classes + " " + actual;
    }

 
    loadData=(data)=>{
        if( typeof data != 'undefined')
           {
               var reviewslist = data.reviews; 
               var rating = 0;
               reviewslist.forEach((v,i)=>{
                   
                   rating = v.totalrating / v.num_reviews ; 
                   if(rating > this.maxRating )
                    this.maxRating=rating;
               }); 

            }

          

        return true;
    }



    public getEmployeeImage(e)
    {   
         
        //let employee =  this.data.employees[employee_id];
        //if(!employee) return '';
        //let image_id = employee.image_id || 0;
        return `/core/api/v1/images/${e.for_employee_id}`;
    }


}
