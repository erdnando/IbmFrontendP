import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpCreateParameterComponent } from './pop-up-create-parameter.component';

describe('PopUpCreateParameterComponent', () => {
  let component: PopUpCreateParameterComponent;
  let fixture: ComponentFixture<PopUpCreateParameterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpCreateParameterComponent]
    });
    fixture = TestBed.createComponent(PopUpCreateParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
