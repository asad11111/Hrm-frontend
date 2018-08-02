import { Injectable }             from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class UserResolver implements Resolve<any>{


  constructor(protected auth:AuthService) {}

  resolve(route: ActivatedRouteSnapshot){
    var user = this.auth.getUser();
    if(!user){
      return this.auth.fetchUser();
    }
  }
}