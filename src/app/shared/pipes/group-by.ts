import {PipeTransform, Pipe} from "@angular/core";

@Pipe({name: 'groupBy'})
export class GroupByPipe implements PipeTransform {
    transform(value:any, field: string): Array<any> {
        if(!Array.isArray(value)){
            value = Object.values(value);
        }
        const groupedObj = value.reduce((prev, cur)=> {
            if(!prev[cur[field]]) {
                prev[cur[field]] = [cur];
            } else {
                prev[cur[field]].push(cur);
            }
            return prev;
        }, {});
        return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
    }
}