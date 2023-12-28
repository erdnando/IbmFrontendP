import { TestBed } from '@angular/core/testing';

import { FestivosListService } from './festivos-list.service';

describe('FestivosListService', () => {
  let service: FestivosListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FestivosListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
