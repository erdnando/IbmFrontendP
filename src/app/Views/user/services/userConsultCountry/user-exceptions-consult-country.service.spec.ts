import { TestBed } from '@angular/core/testing';

import { UserExceptionsConsultCountryService } from './user-exceptions-consult-country.service';

describe('UserExceptionsConsultCountryService', () => {
  let service: UserExceptionsConsultCountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserExceptionsConsultCountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
