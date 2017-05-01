import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgmtComponent } from './mgmt.component';

describe('MgmtComponent', () => {
  let component: MgmtComponent;
  let fixture: ComponentFixture<MgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
