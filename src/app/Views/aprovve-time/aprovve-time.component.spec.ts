import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovveTimeComponent } from './aprovve-time.component';

describe('AprovveTimeComponent', () => {
  let component: AprovveTimeComponent;
  let fixture: ComponentFixture<AprovveTimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AprovveTimeComponent]
    });
    fixture = TestBed.createComponent(AprovveTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
