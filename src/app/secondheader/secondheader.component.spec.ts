import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondheaderComponent } from './secondheader.component';

describe('SecondheaderComponent', () => {
  let component: SecondheaderComponent;
  let fixture: ComponentFixture<SecondheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
