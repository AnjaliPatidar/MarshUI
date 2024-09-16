import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import { routes } from './app.routes';
const oktaAuth = new OktaAuth({
  issuer: 'https://mmc.oktapreview.com/oauth2',
  clientId: 'Ooamsfj6c75REfaPKoh7',
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
});

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), { provide: OKTA_CONFIG, useValue: { oktaAuth } }]
};
