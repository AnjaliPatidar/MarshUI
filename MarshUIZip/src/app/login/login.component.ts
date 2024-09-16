import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthModule, OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [OktaAuthModule,CommonModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  title = 'Okta-Angular-App';
  public isAuthenticated$!: Observable<boolean>;

  constructor(
    private _oktaStateService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth
  ) {}

  // Subscribe to OktaAuthState to see if user is authenticated
  public ngOnInit(): void {
    this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
      filter((s: AuthState) => !!s),
      map((s: AuthState) => s.isAuthenticated ?? false)
    );
  }

  // Sign In Method
  public async signIn(): Promise<void> {
    console.log(this.isAuthenticated$, "login working", "*********",await this._oktaAuth.getAccessToken())
    await this._oktaAuth.signInWithRedirect();
    
    // If you want the callback route always redirects user to a specific page after sign-in, 
    // use the following line instead.
    // await this._oktaAuth.signInWithRedirect().then(_ => this._router.navigate(['/profile']));
  }

  // Sign Out Method
  public async signOut(): Promise<void> {
    await this._oktaAuth.signOut();
  }
}
