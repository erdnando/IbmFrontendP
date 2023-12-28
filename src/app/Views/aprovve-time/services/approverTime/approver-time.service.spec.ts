import { TestBed } from '@angular/core/testing';

import { ApproverTimeService } from './approver-time.service';

describe('ApproverTimeService', () => {
  let service: ApproverTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproverTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
