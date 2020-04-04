import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsPerPositiveComponent } from './test-rate.component';

describe('TestsPerPositiveComponent', () => {
  let component: TestsPerPositiveComponent;
  let fixture: ComponentFixture<TestsPerPositiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestsPerPositiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsPerPositiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
