import { TestBed } from '@angular/core/testing';

import { RolesMenuService } from './roles-menu.service';

describe('RolesMenuService', () => {
  let service: RolesMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});