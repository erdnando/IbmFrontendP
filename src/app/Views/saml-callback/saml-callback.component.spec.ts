import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamlComponent } from './saml.component';

describe('DashboardComponent', () => {
  let component: SamlComponent;
  let fixture: ComponentFixture<SamlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamlComponent]
    });
    fixture = TestBed.createComponent(SamlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
