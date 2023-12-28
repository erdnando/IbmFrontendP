import { TestBed } from '@angular/core/testing';

import { RolesCreateService } from './roles-create.service';

describe('RolesCreateService', () => {
  let service: RolesCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
