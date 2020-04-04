import { Component } from '@angular/core';
import { StateStats } from "../covidtracker/covidtracker.service";
import { GraphsComponent } from "../graphs/graphs.component";
import { PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-tests-per-positive',
  templateUrl: '../graphs/graphs.component.html',
  styleUrls: ['../graphs/graphs.component.css']
})
export class TestsPerPositiveComponent extends GraphsComponent {
  layout = Object.assign(this.getBaseLayout(), {
    yaxis: {
      title: 'Tests Per Positive (smoothed)',
      rangemode: 'tozero',
      hoverformat: '.1f',
    }
  });

  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  getDataForState(state: StateStats): number[] {
    return state.smoothedTestsPerPositive;
  }
}
