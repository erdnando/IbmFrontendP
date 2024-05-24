import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpAddLoadComponent } from './pop-up-add-load.component';

describe('PopUpAddLoadComponent', () => {
  let component: PopUpAddLoadComponent;
  let fixture: ComponentFixture<PopUpAddLoadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpAddLoadComponent]
    });
    fixture = TestBed.createComponent(PopUpAddLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
