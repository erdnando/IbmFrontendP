import { TestBed } from '@angular/core/testing';

import { ParameterConsultService } from './parameter-consult.service';

describe('ParameterConsultService', () => {
  let service: ParameterConsultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParameterConsultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
