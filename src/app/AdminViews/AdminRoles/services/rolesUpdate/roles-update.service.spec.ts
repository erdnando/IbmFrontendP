import { TestBed } from '@angular/core/testing';

import { RolesUpdateService } from './roles-update.service';

describe('RolesUpdateService', () => {
  let service: RolesUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
