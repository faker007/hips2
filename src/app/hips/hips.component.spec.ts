import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HipsComponent } from './hips.component';

describe('HipsComponent', () => {
  let component: HipsComponent;
  let fixture: ComponentFixture<HipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
