import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';



@Injectable()
export class AuthService {

    public data: any;

    public constructor(
        protected http: Http,
        protected router:Router
        ){
    }
    getUser(){
        return this.data;
    }
    fetchUser(){
        var opts = {body:{token: this.getToken()}};
        return new Promise((resolve, reject)=>{
            this.http.get('/core/api/v1/user', opts).subscribe((res)=>{
                this.data = res.json().data;
                //console.log(this.data);
                resolve(this.data);
            },(res)=>{
                resolve();
                localStorage.removeItem('_token');
                this.router.navigate(['/login']);
            });
        });
    }
    getToken(){
        return localStorage.getItem('_token');
    }
    login(data:any){
        localStorage.setItem('_token', data.token);
        this.data = data;
        this.router.navigate(['/']);
    }
    logout(){
        localStorage.removeItem('_token');
        this.router.navigate(['login']);
    }
    isAuthenticated(){
        var token = localStorage.getItem('_token');
        return token !== null;
    }
    hasModule(name){
        return this.data.modules.some((m)=>{
            return m.name === name;
        });
    }
} 