import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GraphsFixture } from "../graphs/graphs-fixture";

import { DailyDeathsComponent } from './daily-deaths.component';

describe('DailyDeathsComponent', () => {
  let component: DailyDeathsComponent;
  let fixture: ComponentFixture<DailyDeathsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule(GraphsFixture.getModule())
    TestBed.configureTestingModule({
      declarations: [
        DailyDeathsComponent,
      ],
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyDeathsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
