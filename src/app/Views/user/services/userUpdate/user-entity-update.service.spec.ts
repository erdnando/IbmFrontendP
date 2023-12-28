import { TestBed } from '@angular/core/testing';

import { UserEntityUpdateService } from './user-entity-update.service';

describe('UserEntityUpdateService', () => {
  let service: UserEntityUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserEntityUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
