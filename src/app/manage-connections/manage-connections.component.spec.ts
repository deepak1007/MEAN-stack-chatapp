import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageConnectionsComponent } from './manage-connections.component';

describe('ManageConnectionsComponent', () => {
  let component: ManageConnectionsComponent;
  let fixture: ComponentFixture<ManageConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
