import { Component, OnInit } from '@angular/core';
import { StateStats } from "../covidtracker/covidtracker.service";
import { GraphsComponent } from "../graphs/graphs.component";
import { PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-daily-infections',
  templateUrl: '../graphs/graphs.component.html',
  styleUrls: ['../graphs/graphs.component.css']
})
export class DailyInfectionsComponent extends GraphsComponent {
  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  createLayout(): any {
    return Object.assign(this.getBaseLayout(), {
      yaxis: {
        title: 'Daily Infections (smoothed)',
        rangemode: 'tozero',
        hoverformat: '.0f',
        type: 'log',
        dtick: '',
        autorange: true,
      }
    });
  }

  getDataForState(state: StateStats): number[] {
    return state.smoothedDailyInfections;
  }
}
