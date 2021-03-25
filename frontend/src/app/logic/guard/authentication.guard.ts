import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CustomerSession } from '../data-models/data-models';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {


  public constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {


    let url: string = state.url;
    url = url.split('?')[0];

    if (url === '/' || url === '/register' || url === '/login') {
      return !this.checkLogin(url);
    }
    return this.checkLogin(url);
  }

  private checkLogin(url: string): boolean {
    if (this.authenticationService.isLoggedIn) {
      return true;
    }

    if (!this.cookieService.check('session')) {
      if (url !== '/' && url !== '/login' && url !== '/register') {
        this.router.navigate(['/login']);
      }
      return false;
    }

    const session: CustomerSession = JSON.parse(this.cookieService.get('session'));

    this.authenticationService.signInWithSession(session).subscribe(
      (data) => {
        this.router.navigate([url]);
        return true;
      },
      (error) => {
        this.router.navigate(['/login']);
      }
    );
    return false;
  }
}
