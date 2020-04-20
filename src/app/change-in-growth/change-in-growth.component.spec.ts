import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphsFixture } from "../graphs/graphs-fixture";

import { ChangeInGrowthComponent } from './change-in-growth.component';

describe('ChangeInGrowthComponent', () => {
  let component: ChangeInGrowthComponent;
  let fixture: ComponentFixture<ChangeInGrowthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(GraphsFixture.getModule());
    TestBed.configureTestingModule({
      declarations: [ ChangeInGrowthComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeInGrowthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
