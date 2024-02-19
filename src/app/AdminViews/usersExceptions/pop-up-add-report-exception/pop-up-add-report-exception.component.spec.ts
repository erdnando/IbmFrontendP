import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpCountriesCreateComponent } from './pop-up-countries-create.component';

describe('PopUpCountriesCreateComponent', () => {
  let component: PopUpCountriesCreateComponent;
  let fixture: ComponentFixture<PopUpCountriesCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpCountriesCreateComponent]
    });
    fixture = TestBed.createComponent(PopUpCountriesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
