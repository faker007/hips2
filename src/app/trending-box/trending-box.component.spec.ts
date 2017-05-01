import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingBoxComponent } from './trending-box.component';

describe('TrendingBoxComponent', () => {
  let component: TrendingBoxComponent;
  let fixture: ComponentFixture<TrendingBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
