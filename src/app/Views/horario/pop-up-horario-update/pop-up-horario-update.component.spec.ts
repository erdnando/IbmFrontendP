import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpHorarioUpdateComponent } from './pop-up-horario-update.component';

describe('PopUpHorarioUpdateComponent', () => {
  let component: PopUpHorarioUpdateComponent;
  let fixture: ComponentFixture<PopUpHorarioUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpHorarioUpdateComponent]
    });
    fixture = TestBed.createComponent(PopUpHorarioUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
