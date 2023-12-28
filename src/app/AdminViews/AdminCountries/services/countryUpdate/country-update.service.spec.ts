import { TestBed } from '@angular/core/testing';

import { CountryUpdateService } from './country-update.service';

describe('CountryUpdateService', () => {
  let service: CountryUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
