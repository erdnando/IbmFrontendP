import { TestBed } from '@angular/core/testing';

import { UserConsultCountryService } from './user-consult-country.service';

describe('UserConsultCountryService', () => {
  let service: UserConsultCountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserConsultCountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
