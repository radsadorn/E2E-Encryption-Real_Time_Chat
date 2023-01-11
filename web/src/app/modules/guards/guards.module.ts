import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private router: Router,
    ) {}
    
    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        
        const cognito = this.auth.getCurrentSession();
        if (!cognito) return this.router.navigate(['/login']);
        if ((cognito as any) === '[object Object]') return this.router.navigate(['/login']);
        
        const userToken = this.auth.getUserToken();
        if (!userToken)
            return false;

        return true;
    }

}