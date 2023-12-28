import { TestBed } from '@angular/core/testing';

import { MenusUpdateService } from './menus-update.service';

describe('MenusUpdateService', () => {
  let service: MenusUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenusUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
