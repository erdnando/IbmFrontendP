import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpRolesUpdateComponent } from './pop-up-roles-update.component';

describe('PopUpRolesUpdateComponent', () => {
  let component: PopUpRolesUpdateComponent;
  let fixture: ComponentFixture<PopUpRolesUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpRolesUpdateComponent]
    });
    fixture = TestBed.createComponent(PopUpRolesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
