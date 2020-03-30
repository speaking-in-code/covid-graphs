import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRateComponent } from './test-rate.component';

describe('TestRateComponent', () => {
  let component: TestRateComponent;
  let fixture: ComponentFixture<TestRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
