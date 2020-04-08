import { Component, OnInit } from '@angular/core';
import { StateStats } from "../covidtracker/covidtracker.service";
import { GraphsComponent } from "../graphs/graphs.component";
import { ChosenStates, PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-test-rate',
  templateUrl: '../graphs/graphs.component.html',
  styleUrls: ['../graphs/graphs.component.css']
})
export class TestRateComponent extends GraphsComponent {
  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  createLayout(): any {
    let l = this.getBaseLayout();
    l.yaxis.title = 'Negative Test Rate (smoothed)';
    l.yaxis.tickformat =  '%';
    l.yaxis.range = [0, 1];
    return l;
  }

  getDataForState(state: StateStats): number[] {
    return state.smoothedNegativeRate;
  }
}
