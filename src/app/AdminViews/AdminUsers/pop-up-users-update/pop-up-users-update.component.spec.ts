import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpUsersUpdateComponent } from './pop-up-users-update.component';

describe('PopUpUsersUpdateComponent', () => {
  let component: PopUpUsersUpdateComponent;
  let fixture: ComponentFixture<PopUpUsersUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpUsersUpdateComponent]
    });
    fixture = TestBed.createComponent(PopUpUsersUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
