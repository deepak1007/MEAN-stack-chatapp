import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalpagesComponent } from './normalpages.component';

describe('NormalpagesComponent', () => {
  let component: NormalpagesComponent;
  let fixture: ComponentFixture<NormalpagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormalpagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalpagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
