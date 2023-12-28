import { TestBed } from '@angular/core/testing';

import { UserConsultRolService } from './user-consult-rol.service';

describe('UserConsultRolService', () => {
  let service: UserConsultRolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserConsultRolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
