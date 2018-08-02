import { Injectable }             from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {Http} from "@angular/http";


@Injectable()
export class ReviewConfig {

    protected fetched = false;

    public config:any = null;

    constructor(protected http:Http){   }
    fetch(){
        return new Promise((resolve)=>{
            return this.http.get('review/api/v1/config').subscribe((res)=>{
                this.config = res.json().data;
                resolve();
            });
        });
    }

}

@Injectable()
export class ReviewConfigResolver implements Resolve<any>{


    constructor(protected reviewConfig:ReviewConfig) {}

    resolve(route: ActivatedRouteSnapshot){
        return this.reviewConfig.fetch();
    }
}
