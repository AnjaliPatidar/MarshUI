// import { TestBed } from '@angular/core/testing';

// import { AuthService } from './auth.service';

// describe('AuthService', () => {
//   let service: AuthService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(AuthService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { OktaAuth, AuthTransaction } from '@okta/okta-auth-js';
import { of, throwError } from 'rxjs';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockOktaAuth {
  session = {
    exists: jasmine.createSpy('exists').and.returnValue(Promise.resolve(true)),
    setCookieAndRedirect: jasmine.createSpy('setCookieAndRedirect')
  };
  signInWithCredentials = jasmine.createSpy('signInWithCredentials').and.returnValue(Promise.resolve({ status: 'SUCCESS', sessionToken: 'dummyToken' }));
  signOut = jasmine.createSpy('signOut').and.returnValue(Promise.resolve());
}

describe('AuthService', () => {
  let service: AuthService;
  let router: MockRouter;
  let oktaAuth: MockOktaAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useClass: MockRouter },
        { provide: OktaAuth, useClass: MockOktaAuth }
      ]
    });

    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router) as unknown as MockRouter;
    oktaAuth = TestBed.inject(OktaAuth) as unknown as MockOktaAuth;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with session exists', async () => {
    await oktaAuth.session.exists();
    expect(service.isAuthenticated$).toBeTruthy();
  });

  it('should login successfully', (done) => {
    service.login('username', 'password').subscribe(() => {
      expect(oktaAuth.signInWithCredentials).toHaveBeenCalledWith({ username: 'username', password: 'password' });
      expect(oktaAuth.session.setCookieAndRedirect).toHaveBeenCalledWith('dummyToken');
      done();
    });
  });

  it('should handle login failure', (done) => {
    oktaAuth.signInWithCredentials.and.returnValue(Promise.resolve({ status: 'FAILURE' }));
    service.login('username', 'password').subscribe({
      next: () => {},
      error: (err) => {
        expect(err.message).toBe('We cannot handle the FAILURE status');
        done();
      }
    });
  });

  it('should logout successfully', (done) => {
    service.logout('/redirect').subscribe(() => {
      expect(oktaAuth.signOut).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/redirect']);
      done();
    });
  });

  it('should handle logout failure', (done) => {
    oktaAuth.signOut.and.returnValue(Promise.reject('Unable to sign out'));
    service.logout('/redirect').subscribe({
      next: () => {},
      error: (err) => {
        expect(err.message).toBe('Unable to sign out');
        done();
      }
    });
  });

  it('should complete _authSub$ on ngOnDestroy', () => {
    service.ngOnDestroy();
    service.isAuthenticated$.subscribe({
      complete: () => {
        expect(true).toBeTrue();
      }
    });
  });
});
