import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { CovidTrackerService } from "./covidtracker/covidtracker.service";
import { DailyInfectionsComponent } from "./daily-infections/daily-infections.component";
import { DeathsComponent } from "./deaths/deaths.component";
import { GrowthRateComponent } from "./growth-rate/growth-rate.component";
import { InfectionRateComponent } from "./infection-rate/infection-rate.component";
import { InfectionsComponent } from "./infections/infections.component";
import { TestRateComponent } from "./test-rate/test-rate.component";
import { TestsPerPositiveComponent } from "./tests-per-positive/tests-per-positive.component";
import { TestsComponent } from "./tests/tests.component";

// This gets dynamically updated with a redirect to the states with the largest outbreaks.
const appRoutes: Routes = [
  { path: 'infections', component: InfectionsComponent, pathMatch: 'full' },
  { path: 'daily-infections', component: DailyInfectionsComponent, pathMatch: 'full' },
  { path: 'deaths', component: DeathsComponent, pathMatch: 'full' },
  { path: 'growth', component: GrowthRateComponent, pathMatch: 'full' },
  { path: 'infection-rate', component: InfectionRateComponent, pathMatch: 'full' },
  { path: 'tests', component: TestsComponent, pathMatch: 'full' },
  { path: 'test-rate', component: TestRateComponent, pathMatch: 'full' },
  { path: 'tests-per-positive', component: TestsPerPositiveComponent, pathMatch: 'full' },
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
export class AppRoutingModule {
  // Create a default redirect to the states with the largest outbreaks.
  constructor(private tracker: CovidTrackerService, private router: Router) {
    let queryParams = [];
    tracker.largestOutbreaks.forEach((state: string) => {
      queryParams.push('id=' + state);
    });
    let startingPage = '/infections?' + queryParams.join('&');
    appRoutes.push({
      path: '', redirectTo: startingPage, pathMatch: 'full'
    });
    router.resetConfig(appRoutes);
  }
}
