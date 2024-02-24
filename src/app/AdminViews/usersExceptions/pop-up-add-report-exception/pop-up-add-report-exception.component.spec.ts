import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpAddReportExceptionComponent } from './pop-up-add-report-exception.component';

describe('PopUpAddReportExceptionComponent', () => {
  let component: PopUpAddReportExceptionComponent;
  let fixture: ComponentFixture<PopUpAddReportExceptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpAddReportExceptionComponent]
    });
    fixture = TestBed.createComponent(PopUpAddReportExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
