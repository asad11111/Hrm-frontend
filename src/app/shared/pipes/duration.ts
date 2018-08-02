import {PipeTransform, Pipe} from "@angular/core";
import * as moment from 'moment';

@Pipe({name: 'duration'})
export class DurationPipe implements PipeTransform {
    transform(value:any, unit:any='minutes') {
        if(value){
            let duration = moment.duration(value, unit);
            let hours = Math.round(duration.asHours()).toString();
            if(hours.length === 1) hours = '0'+ hours;
            let minutes = Math.abs(duration.minutes()).toString();
            if(minutes.length === 1) minutes = '0'+ minutes;
            return hours+':'+minutes;
        }
        return value;
    }
}
