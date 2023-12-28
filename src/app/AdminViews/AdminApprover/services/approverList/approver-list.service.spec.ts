import { TestBed } from '@angular/core/testing';

import { ApproverListService } from './approver-list.service';

describe('ApproverListService', () => {
  let service: ApproverListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproverListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
