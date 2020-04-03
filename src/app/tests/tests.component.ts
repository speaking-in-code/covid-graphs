import { Component } from '@angular/core';
import { StateStats } from "../covidtracker/covidtracker.service";
import { GraphsComponent } from "../graphs/graphs.component";
import { ChosenStates, PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-tests',
  templateUrl: '../graphs/graphs.component.html',
  styleUrls: ['../graphs/graphs.component.css']
})
export class TestsComponent extends GraphsComponent {
  layout = Object.assign(this.getBaseLayout(), {
    yaxis: {
      title: 'Negative Tests Per Day (Smoothed)',
      hoverformat: '.0f',
    }
  });

  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  getDataForState(state: StateStats): number[] {
    return state.negativeTestsPerDay;
  }
}
