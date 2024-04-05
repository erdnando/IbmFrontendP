import { TestBed } from '@angular/core/testing';

import {LoadService } from './load.service';

describe('WorkdayExceptionService', () => {
  let service: LoadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
