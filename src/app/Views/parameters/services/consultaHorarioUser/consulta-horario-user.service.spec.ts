import { TestBed } from '@angular/core/testing';

import { ConsultaHorarioUserService } from './consulta-horario-user.service';

describe('ConsultaHorarioUserService', () => {
  let service: ConsultaHorarioUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaHorarioUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
