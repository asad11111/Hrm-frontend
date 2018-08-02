import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';


@Injectable()
export class PkPayrollGuard implements CanActivate {

    constructor(protected auth:AuthService, protected router:Router){

    }
    canActivate() {
        if(this.auth.isAuthenticated()){
            if(this.auth.hasModule('Payroll'))
                return true;
            else
                return false;
        }
        this.router.navigate(['/login']);
        return false;
    }
  
}