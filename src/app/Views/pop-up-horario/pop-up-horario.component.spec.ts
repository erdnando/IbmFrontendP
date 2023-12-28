import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpHorarioComponent } from './pop-up-horario.component';

describe('PopUpHorarioComponent', () => {
  let component: PopUpHorarioComponent;
  let fixture: ComponentFixture<PopUpHorarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpHorarioComponent]
    });
    fixture = TestBed.createComponent(PopUpHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
