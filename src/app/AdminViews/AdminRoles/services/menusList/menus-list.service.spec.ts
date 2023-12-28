import { TestBed } from '@angular/core/testing';

import { MenusListService } from './menus-list.service';

describe('MenusListService', () => {
  let service: MenusListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenusListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
