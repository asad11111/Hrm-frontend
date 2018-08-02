import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import {AuthService} from './auth.service';
import {AuthGuard} from './auth-guard.service';
import {PkPayrollGuard} from './pk-payroll-guard.service';
import {NzPayrollGuard} from './nz-payroll-guard.service';
import {UserResolver} from './user-resolver.service';
import {Permission} from './permission.service';
import {Register} from "./components/register";
import {Login} from "./components/login";
import {ResetPassword} from "./components/reset-password";
import {ForgotPassword} from "./components/forgot-password";
@NgModule({
    imports: [SharedModule],
    declarations: [
        Login, Register,ForgotPassword,ResetPassword
    ],
    exports: [
        Login, Register,ForgotPassword,ResetPassword
    ],
    providers   : [
        AuthService, AuthGuard, PkPayrollGuard, NzPayrollGuard, UserResolver, Permission
    ],
})
export class AuthModule {
}

export {Login, Register, UserResolver, AuthGuard, PkPayrollGuard, NzPayrollGuard,
         AuthService, Permission, ForgotPassword, ResetPassword};