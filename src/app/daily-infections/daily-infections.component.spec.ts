import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyInfectionsComponent } from './daily-infections.component';

describe('DailyInfectionsComponent', () => {
  let component: DailyInfectionsComponent;
  let fixture: ComponentFixture<DailyInfectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyInfectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyInfectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
