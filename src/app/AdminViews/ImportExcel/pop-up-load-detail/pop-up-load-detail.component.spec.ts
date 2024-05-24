import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpLoadDetailComponent } from './pop-up-load-detail.component';

describe('PopUpLoadDetailComponent', () => {
  let component: PopUpLoadDetailComponent;
  let fixture: ComponentFixture<PopUpLoadDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopUpLoadDetailComponent]
    });
    fixture = TestBed.createComponent(PopUpLoadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
