import { TestBed } from '@angular/core/testing';

import { WorkdayExceptionService } from './workday-exception.service';

describe('WorkdayExceptionService', () => {
  let service: WorkdayExceptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkdayExceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
