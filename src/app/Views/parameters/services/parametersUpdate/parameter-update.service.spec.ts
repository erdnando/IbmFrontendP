import { TestBed } from '@angular/core/testing';

import { ParameterUpdateService } from './parameter-update.service';

describe('ParameterUpdateService', () => {
  let service: ParameterUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParameterUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
