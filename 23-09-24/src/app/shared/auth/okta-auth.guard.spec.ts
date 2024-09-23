// import { TestBed } from '@angular/core/testing';
// import { CanActivateFn } from '@angular/router';

// import { oktaAuthGuard } from './okta-auth.guard';

// describe('oktaAuthGuard', () => {
//   const executeGuard: CanActivateFn = (...guardParameters) => 
//       TestBed.runInInjectionContext(() => oktaAuthGuard(...guardParameters));

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//   });

//   it('should be created', () => {
//     expect(executeGuard).toBeTruthy();
//   });
// });


import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { oktaAuthGuard } from './okta-auth.guard';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

class MockAuthService {
  isAuthenticated$ = of(false);
}

class MockRouter {
  parseUrl = jasmine.createSpy('parseUrl').and.callFake((url: string) => url);
}

describe('oktaAuthGuard', () => {
  let authService: MockAuthService;
  let router: MockRouter;
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => oktaAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    });

    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access when user is authenticated', (done) => {
    authService.isAuthenticated$ = of(true);

    const result = executeGuard(null as any, null as any);

    if (result instanceof Observable) {
      result.subscribe((canActivate: any) => {
        expect(canActivate).toBeTrue();
        done();
      });
    } else {
      fail('Guard did not return an observable');
      done();
    }
  });

  it('should redirect to login when user is not authenticated', (done) => {
    authService.isAuthenticated$ = of(false);

    const result = executeGuard(null as any, null as any);

    if (result instanceof Observable) {
      result.subscribe((canActivate: any) => {
        expect(canActivate).toBe('/login');
        expect(router.parseUrl).toHaveBeenCalledWith('/login');
        done();
      });
    } else {
      fail('Guard did not return an observable');
      done();
    }
  });
});
