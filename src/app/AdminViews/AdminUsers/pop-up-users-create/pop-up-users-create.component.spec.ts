import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpUsersCreateComponent } from './pop-up-users-create.component';

describe('PopUpUsersCreateComponent', () => {
  let component: PopUpUsersCreateComponent;
  let fixture: ComponentFixture<PopUpUsersCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpUsersCreateComponent]
    });
    fixture = TestBed.createComponent(PopUpUsersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
