import { TestBed } from '@angular/core/testing';

import { ListCountryService } from './list-country.service';

describe('ListCountryService', () => {
  let service: ListCountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListCountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
