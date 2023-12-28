import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpClientsCreateComponent } from './pop-up-clients-create.component';

describe('PopUpClientsCreateComponent', () => {
  let component: PopUpClientsCreateComponent;
  let fixture: ComponentFixture<PopUpClientsCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpClientsCreateComponent]
    });
    fixture = TestBed.createComponent(PopUpClientsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
