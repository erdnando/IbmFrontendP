import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkdayComponent } from './workday.component';

describe('WorkdayComponent', () => {
  let component: WorkdayComponent;
  let fixture: ComponentFixture<WorkdayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkdayComponent]
    });
    fixture = TestBed.createComponent(WorkdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
