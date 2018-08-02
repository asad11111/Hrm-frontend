import {Component, Input, ElementRef, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
declare var google:any;


@Component({
    selector   : 'tree-designation',
    templateUrl: './tree-designation.html',
})
export class TreeDesignation {

    @ViewChild('designationsChart')
    designationsChart:ElementRef;

    constructor(protected http:Http){

    }
    ngAfterViewInit(){
        {

        }

        google.charts.load('current', {packages:["orgchart"]});
        google.charts.setOnLoadCallback(()=>{
            this.http.get('/core/api/v1/designations/list').subscribe((res)=>{
                var designations = res.json().data;
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Name');
                data.addColumn('string', 'Manager');
                data.addColumn('string', 'ToolTip');
                designations.forEach((d)=>{
                    var id = d.id.toString();
                    var parent_id = d.parent_id ? d.parent_id.toString() : '';
                    data.addRow([{v: id, f: d.name}, parent_id, '']);
                });
                // data.addRows([
                //     [{v:'Mike', f:'Mike'}, '', 'The President'],
                //     [{v:'Jim', f:'Jim'}, 'Mike', 'VP'],
                //     ['Alice', 'Mike', ''],
                //     ['Bob', 'Jim', 'Bob Sponge'],
                //     ['Carol', 'Bob', '']
                // ]);
                var chart = new google.visualization.OrgChart(this.designationsChart.nativeElement);
                chart.draw(data, {allowHtml:true});
            });
        });
    }
}
