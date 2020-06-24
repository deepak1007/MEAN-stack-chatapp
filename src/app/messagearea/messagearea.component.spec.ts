import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageareaComponent } from './messagearea.component';

describe('MessageareaComponent', () => {
  let component: MessageareaComponent;
  let fixture: ComponentFixture<MessageareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
