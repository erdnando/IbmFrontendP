import { TestBed } from '@angular/core/testing';

import { PopUpHistoryService } from './pop-up-history.service';

describe('PopUpHistoryService', () => {
  let service: PopUpHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopUpHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
