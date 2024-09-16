import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OktaLoginComponent } from './okta-login.component';

describe('OktaLoginComponent', () => {
  let component: OktaLoginComponent;
  let fixture: ComponentFixture<OktaLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OktaLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OktaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
