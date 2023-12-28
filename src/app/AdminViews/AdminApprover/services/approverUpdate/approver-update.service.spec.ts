import { TestBed } from '@angular/core/testing';

import { ApproverUpdateService } from './approver-update.service';

describe('ApproverUpdateService', () => {
  let service: ApproverUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproverUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
