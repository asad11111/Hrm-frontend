import {PipeTransform, Pipe} from "@angular/core";


@Pipe({name: 'tokened'})
export class TokenedPipe implements PipeTransform {
    transform(value:any) {
        if(value){
            let token = localStorage.getItem('_token');
            return value + '?token=' + token;
        }
        return value;
    }
}
