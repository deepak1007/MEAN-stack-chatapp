import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddedConnectionsComponent } from './added-connections.component';

describe('AddedConnectionsComponent', () => {
  let component: AddedConnectionsComponent;
  let fixture: ComponentFixture<AddedConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddedConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddedConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
