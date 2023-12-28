import { TestBed } from '@angular/core/testing';

import { MenusCreateService } from './menus-create.service';

describe('MenusCreateService', () => {
  let service: MenusCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenusCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
