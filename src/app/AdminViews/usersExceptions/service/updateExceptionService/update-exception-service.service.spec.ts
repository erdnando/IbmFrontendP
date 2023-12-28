import { TestBed } from '@angular/core/testing';

import { UpdateExceptionServiceService } from './update-exception-service.service';

describe('UpdateExceptionServiceService', () => {
  let service: UpdateExceptionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateExceptionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
