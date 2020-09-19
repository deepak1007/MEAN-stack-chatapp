import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendCircleComponent } from './friend-circle.component';

describe('FriendCircleComponent', () => {
  let component: FriendCircleComponent;
  let fixture: ComponentFixture<FriendCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
