import { TestBed } from '@angular/core/testing';

import { RolesListService } from './roles-list.service';

describe('RolesListService', () => {
  let service: RolesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
