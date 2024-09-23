// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { LoginComponent } from './login.component';

// describe('LoginComponent', () => {
//   let component: LoginComponent;
//   let fixture: ComponentFixture<LoginComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [LoginComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(LoginComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/service/auth.service';
import { LoginComponent } from './login.component';
import { MaterialModule } from '../../shared/module/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceStub: Partial<AuthService>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    authServiceStub = {
      isAuthenticated$: of(true),
      login: jasmine.createSpy('login').and.returnValue(of(true))
    };

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        MaterialModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: { returnUrl: '/home' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial values', () => {
    expect(component.loginValid).toBeTrue();
    expect(component.username).toBe('');
    expect(component.password).toBe('');
  });

  it('should set returnUrl from route queryParams', () => {
    expect(component.returnUrl).toBe('/home');
  });

  // it('should navigate to returnUrl if authenticated on init', () => {
  //   // authServiceStub.isAuthenticated$ = of(true);
  //   component.ngOnInit();
  //   fixture.detectChanges();
  //   spyOn(router, 'navigateByUrl');
  //   expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  // });  

  it('should call AuthService login on submit', () => {
    component.username = 'test';
    component.password = 'password';
    component.onSubmit();
    expect(authServiceStub.login).toHaveBeenCalledWith('test', 'password');
  });

  it('should navigate to /home on successful login', () => {
    spyOn(router, 'navigateByUrl');
    component.onSubmit();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
  });

  // it('should set loginValid to false on login error', () => {
  //   authServiceStub.login = jasmine.createSpy('login').and.returnValue(of(false));
  //   component.onSubmit();
  //   expect(component.loginValid).toBeFalse();
  // });
  

  it('should _destroySub$ on destroy', () => {
    spyOn(component['_destroySub$'], 'next');
    component.ngOnDestroy();
    expect(component['_destroySub$'].next).toHaveBeenCalled();
  });
});

