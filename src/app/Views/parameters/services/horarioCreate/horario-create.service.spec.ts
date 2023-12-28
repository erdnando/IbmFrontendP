import { TestBed } from '@angular/core/testing';

import { HorarioCreateService } from './horario-create.service';

describe('HorarioCreateService', () => {
  let service: HorarioCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
