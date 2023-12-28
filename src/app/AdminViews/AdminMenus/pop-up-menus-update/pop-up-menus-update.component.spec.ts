import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpMenusUpdateComponent } from './pop-up-menus-update.component';

describe('PopUpMenusUpdateComponent', () => {
  let component: PopUpMenusUpdateComponent;
  let fixture: ComponentFixture<PopUpMenusUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpMenusUpdateComponent]
    });
    fixture = TestBed.createComponent(PopUpMenusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
