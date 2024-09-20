import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { oktaConfig } from './shared/constant/okta-config';
import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
  { provide: OKTA_CONFIG, useValue: oktaConfig },
    OktaAuthModule, 
    provideAnimationsAsync()
  ]
};
