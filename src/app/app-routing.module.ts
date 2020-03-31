import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from "./app.component";
import { GrowthRateComponent } from "./growth-rate/growth-rate.component";
import { InfectionRateComponent } from "./infection-rate/infection-rate.component";
import { InfectionsComponent } from "./infections/infections.component";
import { TestRateComponent } from "./test-rate/test-rate.component";
import { TestsComponent } from "./tests/tests.component";

const appRoutes: Routes = [
  { path: '', component: InfectionsComponent, pathMatch: 'full' },
  { path: 'infections', component: InfectionsComponent, pathMatch: 'full' },
  { path: 'growth', component: GrowthRateComponent, pathMatch: 'full' },
  { path: 'infection-rate', component: InfectionRateComponent, pathMatch: 'full' },
  { path: 'tests', component: TestsComponent, pathMatch: 'full' },
  { path: 'test-rate', component: TestRateComponent, pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: false
    }),
    CommonModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
