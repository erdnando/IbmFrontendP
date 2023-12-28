import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpCountriesUpdateComponent } from './pop-up-countries-update.component';

describe('PopUpCountriesUpdateComponent', () => {
  let component: PopUpCountriesUpdateComponent;
  let fixture: ComponentFixture<PopUpCountriesUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpCountriesUpdateComponent]
    });
    fixture = TestBed.createComponent(PopUpCountriesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
