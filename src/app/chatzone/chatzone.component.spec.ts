import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatzoneComponent } from './chatzone.component';

describe('ChatzoneComponent', () => {
  let component: ChatzoneComponent;
  let fixture: ComponentFixture<ChatzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatzoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
