import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpApproverCreateComponent } from './pop-up-approver-create.component';

describe('PopUpApproverCreateComponent', () => {
  let component: PopUpApproverCreateComponent;
  let fixture: ComponentFixture<PopUpApproverCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpApproverCreateComponent]
    });
    fixture = TestBed.createComponent(PopUpApproverCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
