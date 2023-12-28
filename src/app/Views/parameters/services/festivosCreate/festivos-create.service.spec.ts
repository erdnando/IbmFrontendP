import { TestBed } from '@angular/core/testing';

import { FestivosCreateService } from './festivos-create.service';

describe('FestivosCreateService', () => {
  let service: FestivosCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FestivosCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
