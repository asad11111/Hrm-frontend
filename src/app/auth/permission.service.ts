import {Injectable} from '@angular/core'
import {AuthService} from '../auth/auth.service';


@Injectable()
export class Permission {

    constructor(
        protected auth:AuthService
    ){
    }
    can(permission){
        var p = this.auth.data.permissions;
        return p.some((perm)=>{
            return perm.name == permission
        });
    }
}