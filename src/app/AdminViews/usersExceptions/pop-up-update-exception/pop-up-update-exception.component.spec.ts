import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpUpdateExceptionComponent } from './pop-up-update-exception.component';

describe('PopUpUpdateExceptionComponent', () => {
  let component: PopUpUpdateExceptionComponent;
  let fixture: ComponentFixture<PopUpUpdateExceptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpUpdateExceptionComponent]
    });
    fixture = TestBed.createComponent(PopUpUpdateExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
