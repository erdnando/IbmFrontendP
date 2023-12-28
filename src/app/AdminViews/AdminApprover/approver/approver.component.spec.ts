import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverComponent } from './approver.component';

describe('ApproverComponent', () => {
  let component: ApproverComponent;
  let fixture: ComponentFixture<ApproverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApproverComponent]
    });
    fixture = TestBed.createComponent(ApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
