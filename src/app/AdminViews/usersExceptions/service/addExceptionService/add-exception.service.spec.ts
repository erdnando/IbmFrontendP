import { TestBed } from '@angular/core/testing';

import { AddExceptionService } from './add-exception.service';

describe('AddExceptionService', () => {
  let service: AddExceptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddExceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
