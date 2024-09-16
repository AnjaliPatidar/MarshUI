import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthStateService, OktaAuthModule, OKTA_CONFIG, OKTA_AUTH, } from '@okta/okta-angular';
import { OktaAuthOptions } from '@okta/okta-auth-js';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';
import { filter, map, Observable } from 'rxjs';

const oktaAuth = new OktaAuth({
  issuer: 'https://mmc.oktapreview.com/oauth2',
  //clientId : '00acelto8nHS18ELV1t7',
  clientId: 'Ooamsfj6c75REfaPKoh7',
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
});

@Component({
  selector: 'app-okta-login',
  standalone: true,
  imports: [OktaAuthModule, CommonModule],
  templateUrl: './okta-login.component.html',
  styleUrl: './okta-login.component.scss',
  providers: [{ provide: OKTA_CONFIG, useValue: { oktaAuth } }],
})
export class OktaLoginComponent implements OnInit {
  public isAuthenticated$!: Observable<boolean>;
  constructor(private _router: Router,
    private _oktaStateService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth) { }
  // Subscribe to OktaAuthState to see if user is authenticated
  public ngOnInit(): void {
    this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
      filter((s: AuthState) => !!s),
      map((s: AuthState) => s.isAuthenticated ?? false)
    );
  }

  // Sign In Method
  public async signIn(): Promise<void> {
    await this._oktaAuth.signInWithRedirect();
    // If you want the callback route always redirects user to a specific page after sign-in, 
    // use the following line instead.
    // await this._oktaAuth.signInWithRedirect().then(_ => this._router.navigate(['/profile']));
  }

  // Sign Out Method
  public async signOut(): Promise<void> {
    await this._oktaAuth.signOut();
  }

  async login() {
    await this._oktaAuth.signInWithRedirect();
  }
}
