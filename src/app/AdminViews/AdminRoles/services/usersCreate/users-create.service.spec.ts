import { TestBed } from '@angular/core/testing';

import { UsersCreateService } from './users-create.service';

describe('UsersCreateService', () => {
  let service: UsersCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
