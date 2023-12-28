import { TestBed } from '@angular/core/testing';

import { RutaActualService } from './ruta-actual.service';

describe('RutaActualService', () => {
  let service: RutaActualService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RutaActualService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
