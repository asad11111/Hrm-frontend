import {Component, Input, ElementRef, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
declare var google:any;


@Component({
    selector   : 'tree-employees',
    templateUrl: './tree-employees.html',
})
export class TreeEmployees {

    @ViewChild('employeesChart')
    employeesChart:ElementRef;

    constructor(protected http:Http){

    }
    ngAfterViewInit(){
        google.charts.load('current', {packages:["orgchart"]});
        google.charts.setOnLoadCallback(()=>{
            this.http.get('/core/api/v1/employees/list').subscribe((res)=>{
                var employees = res.json().data;
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Name');
                data.addColumn('string', 'Manager');
                data.addColumn('string', 'ToolTip');
                employees.forEach((e)=>{
                    var v = e.id.toString();
                    var f = `${e.first_name} ${e.last_name} - ${e.designation}`;
                    var parent_id = e.parent_id ? e.parent_id.toString() : '';
                    data.addRow([{v: v, f: f}, parent_id, '']);
                });
                var chart = new google.visualization.OrgChart(this.employeesChart.nativeElement);
                chart.draw(data, {allowHtml:true});
            });
        });
    }
}
