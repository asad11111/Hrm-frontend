import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class Fetch {

    constructor(public http:Http){

    }
    paginate <T> (url, page, params={}) : Observable<PaginatedResult<T>> {

        return Observable.create((observer)=>{

            let r = new PaginatedResult<T>();
            r.fetching = true;
            observer.next(r);

            params = Object.assign({}, params, {page: page});

            this.http.get(url, {search: params}).subscribe((res)=>{
                let r = res.json();
                let result = new PaginatedResult<T>();
                result.data = res.json().data;
                result.fetched = true;
                result.data = r.data;
                result.current_page  = r.current_page;
                result.per_page = r.per_page;
                result.from = r.from;
                result.to = r.to;
                result.total = r.total;
                observer.next(result);
            }, (res)=>{
                let result = new PaginatedResult<T>();
                result.current_page = page;
                result.failed = true;
                return observer.next(result);
            });
        });
    }
    all <T> (url, opts?): Observable<FetchedArrayResult<T>> {

        return Observable.create((observer)=>{
            let result = new FetchedArrayResult<T>();
            result.fetching = true;
            observer.next(result);
            this.http.get(url, opts).subscribe((res)=>{
                let result = new FetchedArrayResult<T>();
                result.data = res.json().data;
                result.fetched = true;
                observer.next(result);
            },
            (res)=>{
                let result = new FetchedArrayResult<T>();
                result.failed = true;
                return observer.next(result);
            });
        });
    }
    one <T> (url, opts) : Observable<FetchedResult<T>> {
        return Observable.create((observer)=>{
            let result = new FetchedResult<T>();
            result.fetching = true;
            observer.next(result);
            this.http.get(url, opts).subscribe((res)=>{
                let result = new FetchedResult();
                result.data = res.json().data;
                result.fetched = true;
                observer.next(result);
            },
            (res)=>{
                let result = new FetchedResult<T>();
                result.failed = true;
                return observer.next(result);
            });
        });
    }
}

export class FetchedResult <T> {

    data:T;

    fetching:boolean = false;

    fetched:boolean = false;

    failed:boolean = false;

}

export class FetchedArrayResult <T> {

    data: Array<T> = [];

    fetching:boolean = false;

    fetched:boolean = false;

    failed:boolean = false;
}
export class PaginatedResult <T> {

    data:T;

    fetching:boolean = false;

    fetched:boolean = false;

    failed:boolean = false;

    current_page: number = 0;

    per_page: number = 0;

    from: number;

    to:number;

    total:number = 0;

}
