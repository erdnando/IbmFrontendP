import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpMenusCreateComponent } from './pop-up-menus-create.component';

describe('PopUpMenusCreateComponent', () => {
  let component: PopUpMenusCreateComponent;
  let fixture: ComponentFixture<PopUpMenusCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpMenusCreateComponent]
    });
    fixture = TestBed.createComponent(PopUpMenusCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
