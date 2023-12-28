import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpAddExceptionComponent } from './pop-up-add-exception.component';

describe('PopUpAddExceptionComponent', () => {
  let component: PopUpAddExceptionComponent;
  let fixture: ComponentFixture<PopUpAddExceptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpAddExceptionComponent]
    });
    fixture = TestBed.createComponent(PopUpAddExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
