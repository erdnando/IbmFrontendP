import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpAprovveComponent } from './pop-up-aprovve.component';

describe('PopUpAprovveComponent', () => {
  let component: PopUpAprovveComponent;
  let fixture: ComponentFixture<PopUpAprovveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpAprovveComponent]
    });
    fixture = TestBed.createComponent(PopUpAprovveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
