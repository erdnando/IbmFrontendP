import { TestBed } from '@angular/core/testing';

import { ReportExceptionService } from './report-exception.service';

describe('ReportExceptionService', () => {
  let service: ReportExceptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportExceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
