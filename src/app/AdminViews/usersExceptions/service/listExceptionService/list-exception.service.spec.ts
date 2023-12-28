import { TestBed } from '@angular/core/testing';

import { ListExceptionService } from './list-exception.service';

describe('ListExceptionService', () => {
  let service: ListExceptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListExceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
