import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpScheduleCreateComponent } from './pop-up-schedule-create.component';

describe('PopUpScheduleCreateComponent', () => {
  let component: PopUpScheduleCreateComponent;
  let fixture: ComponentFixture<PopUpScheduleCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpScheduleCreateComponent]
    });
    fixture = TestBed.createComponent(PopUpScheduleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
