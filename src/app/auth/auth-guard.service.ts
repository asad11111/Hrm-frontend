import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(protected auth:AuthService, protected router:Router){ }
    canActivate() {
        if(this.auth.isAuthenticated()){
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
  
}