import { TestBed } from '@angular/core/testing';

import { ClientUpdateService } from './client-update.service';

describe('ClientUpdateService', () => {
  let service: ClientUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
