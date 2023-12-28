import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersExceptionsComponent } from './users-exceptions.component';

describe('UsersExceptionsComponent', () => {
  let component: UsersExceptionsComponent;
  let fixture: ComponentFixture<UsersExceptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersExceptionsComponent]
    });
    fixture = TestBed.createComponent(UsersExceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
