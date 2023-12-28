import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupFestivosComponent } from './popup-festivos.component';

describe('PopupFestivosComponent', () => {
  let component: PopupFestivosComponent;
  let fixture: ComponentFixture<PopupFestivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupFestivosComponent]
    });
    fixture = TestBed.createComponent(PopupFestivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
