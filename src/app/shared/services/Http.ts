import {Http, RequestOptions, Response} from "@angular/http";
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import {Observable} from "rxjs/Observable";
import {TimeoutError} from "rxjs/util/TimeoutError";


export class Request {

    status = new RequestStatus();
    retryOn = [504];
    timeoutValue = 3000;

    constructor(public type = 'get', public url, public opts:RequestOptions, public http:Http){

    }
    public send():Observable<Response>{
        return Observable.create((o)=>{
            this.status.set(false, true, false);
            let observable = this.http[this.type](this.url, this.opts);
            if(this.type === 'get'){
                observable = this.applyRetry(observable);
            }
            observable.subscribe((res)=>{
                this.status.set(true, false, false);
                o.next(res);
            }, (res)=>{
                this.status.set(false, false, true);
                o.error(res);
            });
        });
    }

    public setTimeout(i){ this.timeoutValue = parseInt(i);   }
    public resetsetTimeout(){ this.timeoutValue = 3000;   }
    
    protected applyRetry(observable){
        let retries = 0;
        return observable.timeout(this.timeoutValue)
            .retryWhen((errors)=>{ return errors.flatMap((res)=> {
                if(retries < 2){
                    retries = retries + 1;
                    if(res instanceof TimeoutError){
                        return Observable.of(res);
                    }
                    else if(this.retryOn.indexOf(res.status) != -1){
                        return Observable.of(res) ;
                    }
                }
                return Observable.throw(res);
            })
        });
    }
}

@Injectable()
export class HttpClient {

    public constructor(public http:Http){

    }
    public get(url:string, opts?){
        return new Request('get', url, opts, this.http );
    }
}

export class RequestStatus {

    constructor(public completed = false, public inProgress = false, public failed = false){}

    public set(completed = false, inProgress = false,failed = false){
        this.completed = completed;
        this.inProgress = inProgress;
        this.failed = failed;
    }


}

export class PaginatedResult <T> {

    data:T;

    current_page: number = 0;

    per_page: number = 0;

    from: number;

    to:number;

    total:number = 0;

}
