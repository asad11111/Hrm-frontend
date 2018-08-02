import {Pipe, PipeTransform} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import * as moment from 'moment-timezone';


@Pipe({ name: 'local',  pure: true })
export class UserDate implements PipeTransform {

    constructor(protected auth:AuthService){

    }
    transform(value: any, format=null): any {
        if(!value) return value;
        let tz = this.auth.data.office.timezone;
        return moment.utc(value, format).tz(tz).format('YYYY-MM-DD HH:mm:ss');
    }
}

@Pipe({ name: 'moment',  pure: true })
export class MomentPipe implements PipeTransform
{
    public outFormat = 'YYYY-MM-DD HH:mm:ss';

    transform(value: any, inFormat=null, outFormat=null): any {
        if(!value) return value;
        return moment.utc(value, inFormat).format(outFormat || this.outFormat);
    }
}

@Pipe({ name: 'momentTz',  pure: true })
export class MomentPipeTz implements PipeTransform
{
    public outFormat = 'YYYY-MM-DD HH:mm:ss';

    constructor(protected auth:AuthService){

    }

    transform(value: any, inFormat=null, outFormat=null): any {
        if(!value) return value;
        let tz = this.auth.data.office.timezone;
        return moment.utc(value, inFormat).tz(tz).format(outFormat || this.outFormat);
    }
}
