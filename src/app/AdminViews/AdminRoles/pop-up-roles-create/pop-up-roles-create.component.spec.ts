import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpRolesCreateComponent } from './pop-up-roles-create.component';

describe('PopUpRolesCreateComponent', () => {
  let component: PopUpRolesCreateComponent;
  let fixture: ComponentFixture<PopUpRolesCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpRolesCreateComponent]
    });
    fixture = TestBed.createComponent(PopUpRolesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
