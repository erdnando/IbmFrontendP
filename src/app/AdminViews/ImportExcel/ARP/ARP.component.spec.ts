import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ARPComponent } from './ARP.component';

describe('ARPComponent', () => {
  let component: ARPComponent;
  let fixture: ComponentFixture<ARPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ARPComponent]
    });
    fixture = TestBed.createComponent(ARPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
