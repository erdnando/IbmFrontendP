import { TestBed } from '@angular/core/testing';

import { UsersUpdateService } from './users-update.service';

describe('UsersUpdateService', () => {
  let service: UsersUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
