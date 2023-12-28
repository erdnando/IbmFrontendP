import { TestBed } from '@angular/core/testing';

import { ObtenerlistaService } from './obtenerlista.service';

describe('ObtenerlistaService', () => {
  let service: ObtenerlistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObtenerlistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
