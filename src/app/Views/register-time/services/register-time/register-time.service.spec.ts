import { TestBed } from '@angular/core/testing';

import { RegisterTimeService } from './register-time.service';

describe('RegisterTimeService', () => {
  let service: RegisterTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
