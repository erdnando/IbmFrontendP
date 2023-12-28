import { TestBed } from '@angular/core/testing';

import { UserConsultByCodeEmService } from './user-consult-by-code-em.service';

describe('UserConsultByCodeEmService', () => {
  let service: UserConsultByCodeEmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserConsultByCodeEmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
