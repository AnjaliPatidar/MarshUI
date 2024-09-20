import { Inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, catchError, from, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthnTransaction, OktaAuth } from '@okta/okta-auth-js';
import { OKTA_CONFIG } from '@okta/okta-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _authClients: OktaAuth;
  private _authSub$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public get isAuthenticated$(): Observable<boolean> {
    return this._authSub$.asObservable();
  }

  constructor(private _router: Router, @Inject(OKTA_CONFIG) private _authClient: OktaAuth) {
    this._authClients = new OktaAuth({
      issuer: 'https://trial-2718395.okta.com/oauth2/default',
      clientId: "0oaj0jpf6pR8CT9T0697",
      redirectUri: window.location.origin + '/login/callback',
      scopes: ['openid', 'profile', 'email'],
      pkce: true
      
    });
    this._authClient.session?.exists().then(exists => this._authSub$.next(exists));
  }

  public ngOnDestroy(): void {
    this._authSub$.next(false);
    this._authSub$.complete();
  }

  public login(username: string, password: string): Observable<void> {
    console.log(this._authClients,'OktaAuth instance:', this._authClient);
  console.log('Calling signIn with:', { username, password });
    return from(this._authClients.idx.authenticate({username, password})).pipe(
      map((t: AuthnTransaction) => this.handleSignInResponse(t))
    );
  }

  public logout(redirect: string): Observable<void> {
    return from(this._authClient.signOut()).pipe(
      map(() => void 0),
      tap(() => {
        this._authSub$.next(false);
        this._router.navigate([redirect]);
      }),
      catchError(err => {
        console.error(err);
        throw new Error('Unable to sign out');
      })
    );
  }

  private handleSignInResponse(transaction: AuthnTransaction): void {
    console.log(transaction,'transaction*******')
    if (transaction.status !== 'SUCCESS') {
      throw new Error(`We cannot handle the ${transaction.status} status`);
    }

    this._authSub$.next(true)
    this._authClient.session.setCookieAndRedirect(transaction.sessionToken);
  }
}
