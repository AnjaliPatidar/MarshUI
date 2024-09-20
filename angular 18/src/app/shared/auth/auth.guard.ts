// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };


import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this._authService.isAuthenticated$
      .pipe(
        map((s: boolean) => s ? true: this._router.parseUrl('/login'))
      );
  }
}
