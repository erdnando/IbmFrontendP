import { TestBed } from '@angular/core/testing';

import { ApproverTimeCreateService } from './approver-time-create.service';

describe('ApproverTimeCreateService', () => {
  let service: ApproverTimeCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproverTimeCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
