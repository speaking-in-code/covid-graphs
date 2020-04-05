import { TestBed, async } from '@angular/core/testing';
import { MatTabsModule } from "@angular/material/tabs";
import { Routes } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from './app.component';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  template: ``
})
export class FakeComponent {}

const routes: Routes = [
  {
    path: '', component: FakeComponent,
  },
];

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        MatTabsModule,
      ],
      declarations: [
        AppComponent,
        FakeComponent,
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
