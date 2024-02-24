import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpAddWorkdayExceptionComponent } from './pop-up-add-workday-exception.component';

describe('PopUpAddWorkdayExceptionComponent', () => {
  let component: PopUpAddWorkdayExceptionComponent;
  let fixture: ComponentFixture<PopUpAddWorkdayExceptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpAddWorkdayExceptionComponent]
    });
    fixture = TestBed.createComponent(PopUpAddWorkdayExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
