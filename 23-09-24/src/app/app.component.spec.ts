import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthService } from './shared/service/auth.service';
import { of, Subject } from 'rxjs';
import { MaterialModule } from './shared/module/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockAuthService {
  private _authSub$ = new Subject<boolean>();
  isAuthenticated$ = this._authSub$.asObservable();
  logout() {
    return of(true);
  }
  emitAuthState(isAuthenticated: boolean) {
    this._authSub$.next(isAuthenticated);
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: MockAuthService;
  let destroySub$: Subject<void>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        MaterialModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [{ provide: AuthService, useClass: MockAuthService }]
    }).compileComponents();
    
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    destroySub$ = new Subject<void>();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
  
  it('should call on init', () => {
    authService.emitAuthState(true);
    component.ngOnInit();
    fixture.detectChanges();
    // expect(component.isAuthenticated).toBeTrue();
  });  

  it('should call AuthService.logout when logout is called', () => {
    const logoutSpy = spyOn(authService, 'logout').and.callThrough();
    component.logout();
    expect(logoutSpy).toHaveBeenCalled();
  });


});
