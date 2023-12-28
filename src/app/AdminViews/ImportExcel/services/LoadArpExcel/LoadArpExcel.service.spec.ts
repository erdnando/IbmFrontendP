import { TestBed } from '@angular/core/testing';

import { LoadArpExcelService } from './LoadArpExcel.service';

describe('LoadArpExcelService', () => {
  let service: LoadArpExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadArpExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
