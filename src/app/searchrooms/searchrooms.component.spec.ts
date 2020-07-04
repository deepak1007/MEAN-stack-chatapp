import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchroomsComponent } from './searchrooms.component';

describe('SearchroomsComponent', () => {
  let component: SearchroomsComponent;
  let fixture: ComponentFixture<SearchroomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchroomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
