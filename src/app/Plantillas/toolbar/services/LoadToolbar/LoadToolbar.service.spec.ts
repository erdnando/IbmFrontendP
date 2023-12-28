import { TestBed } from '@angular/core/testing';

import { LoadToolbarService } from './LoadToolbar.service';

describe('LoadToolbarService', () => {
  let service: LoadToolbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadToolbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
