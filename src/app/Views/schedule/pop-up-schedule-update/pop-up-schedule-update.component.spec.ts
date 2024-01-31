import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpScheduleUpdateComponent } from './pop-up-schedule-update.component';

describe('PopUpScheduleUpdateComponent', () => {
  let component: PopUpScheduleUpdateComponent;
  let fixture: ComponentFixture<PopUpScheduleUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpScheduleUpdateComponent]
    });
    fixture = TestBed.createComponent(PopUpScheduleUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
