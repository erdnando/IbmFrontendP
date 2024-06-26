import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpHorarioCreateComponent } from './pop-up-horario-create.component';

describe('PopUpHorarioCreateComponent', () => {
  let component: PopUpHorarioCreateComponent;
  let fixture: ComponentFixture<PopUpHorarioCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpHorarioCreateComponent]
    });
    fixture = TestBed.createComponent(PopUpHorarioCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
