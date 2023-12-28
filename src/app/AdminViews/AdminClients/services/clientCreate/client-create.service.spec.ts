import { TestBed } from '@angular/core/testing';

import { ClientCreateService } from './client-create.service';

describe('ClientCreateService', () => {
  let service: ClientCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
