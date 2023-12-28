import { TestBed } from '@angular/core/testing';
import { ApiParameters } from './api.parameters';

describe('ApiParameters', () => {
  let service: ApiParameters;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiParameters);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
