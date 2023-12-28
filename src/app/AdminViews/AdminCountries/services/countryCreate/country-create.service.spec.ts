import { TestBed } from '@angular/core/testing';

import { CountryCreateService } from './country-create.service';

describe('CountryCreateService', () => {
  let service: CountryCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
