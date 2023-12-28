import { TestBed } from '@angular/core/testing';

import { RegistersHoursReportService } from './registers-hours-report.service';

describe('RegistersHoursReportService', () => {
  let service: RegistersHoursReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistersHoursReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
