import {PipeTransform, Pipe} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({name: 'values'})
export class Values implements PipeTransform {
    transform(value:any): Array<any> {
        return Object.values(value);
    }
}

@Pipe({name: 'keyVal'})
export class KeyVal implements PipeTransform {
    transform(value, args:string[]) : any {
        let keys = [];
        for (let key in value) {
            keys.push({key: key, value: value[key]});
        }
        return keys;
    }
}
@Pipe({ name: 'safe'})
export class SafeHtmlPipe implements PipeTransform  {
    constructor(private sanitized: DomSanitizer) {}
    transform(value, type='html') {
        if(value) {
            if(type === 'url'){
                console.log('here');
                return this.sanitized.bypassSecurityTrustResourceUrl(value);
            }
            return this.sanitized.bypassSecurityTrustHtml(value);
        }
    }
}