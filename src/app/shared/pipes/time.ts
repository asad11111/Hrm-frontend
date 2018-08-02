import {PipeTransform, Pipe} from "@angular/core";
import * as moment from 'moment';

@Pipe({name: 'amPm'})
export class TimePipe implements PipeTransform {
    transform(value:any) {
        if(value){
            return moment(value, ["HH:mm"]).format("h:mm A");
        }
        return value;
    }
}
