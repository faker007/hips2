import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendTagComponent } from './trend-tag.component';

describe('TrendTagComponent', () => {
  let component: TrendTagComponent;
  let fixture: ComponentFixture<TrendTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
