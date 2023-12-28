import { TestBed } from '@angular/core/testing';
import { ApiLogin } from './api.login';

describe('ApiLogin', () => {
  let service: ApiLogin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiLogin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
