import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/timeout';


export function loadModule(name, cb){
    return ()=>{
        return Observable.create((observer)=>{
            cb((module)=>{
                observer.next(module[name]);
                observer.complete();
            },(e)=>{
                throw e;
            });
        })
        .timeout(3000)
        .retry();
    };
}