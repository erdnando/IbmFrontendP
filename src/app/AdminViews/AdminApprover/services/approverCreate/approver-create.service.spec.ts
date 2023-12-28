import { TestBed } from '@angular/core/testing';

import { ApproverCreateService } from './approver-create.service';

describe('ApproverCreateService', () => {
  let service: ApproverCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApproverCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
