import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpClientsUpdateComponent } from './pop-up-clients-update.component';

describe('PopUpClientsUpdateComponent', () => {
  let component: PopUpClientsUpdateComponent;
  let fixture: ComponentFixture<PopUpClientsUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpClientsUpdateComponent]
    });
    fixture = TestBed.createComponent(PopUpClientsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
