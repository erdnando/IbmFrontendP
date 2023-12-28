import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupHistoryComponent } from './popup-history.component';

describe('PopupHistoryComponent', () => {
  let component: PopupHistoryComponent;
  let fixture: ComponentFixture<PopupHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupHistoryComponent]
    });
    fixture = TestBed.createComponent(PopupHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
