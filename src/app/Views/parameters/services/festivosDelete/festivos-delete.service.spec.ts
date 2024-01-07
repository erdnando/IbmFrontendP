import { TestBed } from '@angular/core/testing';

import { FestivosDeleteService } from './festivos-delete.service';

describe('FestivosDeleteService', () => {
  let service: FestivosDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FestivosDeleteService);
  });

  it('should be deleted', () => {
    expect(service).toBeTruthy();
  });
});
