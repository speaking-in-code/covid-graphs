import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphsFixture } from "../graphs/graphs-fixture";

import { GrowthRateComponent } from './growth-rate.component';

describe('GrowthRateComponent', () => {
  let component: GrowthRateComponent;
  let fixture: ComponentFixture<GrowthRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(GraphsFixture.getModule());
    TestBed.configureTestingModule({
      declarations: [ GrowthRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowthRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
