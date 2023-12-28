import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpApproverUpdateComponent } from './pop-up-approver-update.component';

describe('PopUpApproverUpdateComponent', () => {
  let component: PopUpApproverUpdateComponent;
  let fixture: ComponentFixture<PopUpApproverUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpApproverUpdateComponent]
    });
    fixture = TestBed.createComponent(PopUpApproverUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
