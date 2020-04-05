import { Component, OnInit } from '@angular/core';
import { StateStats } from "../covidtracker/covidtracker.service";
import { GraphsComponent } from "../graphs/graphs.component";
import { ChosenStates, PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-growth-rate',
  templateUrl: '../graphs/graphs.component.html',
  styleUrls: ['../graphs/graphs.component.css']
})
export class GrowthRateComponent extends GraphsComponent {
  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  createLayout(): any {
    return Object.assign(this.getBaseLayout(), {
      automargin: true,
      yaxis: {
        title: 'Growth Rate (smoothed)',
        tickformat: '%',
        rangemode: 'tozero',
      }
    });
  }

  getDataForState(state: StateStats): number[] {
    return state.smoothedGrowthRate;
  }
}
