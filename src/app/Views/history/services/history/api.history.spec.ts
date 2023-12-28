import { TestBed } from '@angular/core/testing';

import { ApiHistory } from './api.history';

describe('ApiHistory', () => {
  let service: ApiHistory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiHistory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
