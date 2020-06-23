import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatzonesidenavComponent } from './chatzonesidenav.component';

describe('ChatzonesidenavComponent', () => {
  let component: ChatzonesidenavComponent;
  let fixture: ComponentFixture<ChatzonesidenavComponent>;
   
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatzonesidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatzonesidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
