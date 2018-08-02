import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export class MapsResolver implements Resolve<any> {

    protected apiKey = 'AIzaSyCFegbLnU6VGohwVh2Pre9aL0c3L99i3l8';

    protected url = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=';
    protected loaded = false;

    constructor(private http:Http) {

    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
        return new Promise((resolve, reject)=>{
            if(this.loaded) return resolve();
            var url = this.url +  this.apiKey;
            this.loadGoogleMapsLib(url, resolve);
        });
    }
    loadGoogleMapsLib(url, cb){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = () => {
            this.loaded = true;
            cb();
        };
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
}