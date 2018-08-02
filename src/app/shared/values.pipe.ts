// import {Pipe, PipeTransform} from '@angular/core';
//
//
// @Pipe({ name: 'values',  pure: false })
// export class ValuesPipe implements PipeTransform {
//   transform(value: any, args: any[] = null): any {
//     return Object.keys(value).map(key => value[key]);
//   }
// }
//
//
// @Pipe({name: 'keys'})
// export class KeysPipe implements PipeTransform {
//   transform(value, args:string[]) : any {
//     let keys = [];
//     for (let key in value) {
//       keys.push(key);
//     }
//     return keys;
//   }
// }