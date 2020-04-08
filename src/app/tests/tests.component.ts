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
  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  createLayout(): any {
    let l = this.getBaseLayout();
    l.yaxis.title = 'Negative Tests Per Day (Smoothed)';
    l.yaxis.hoverformat = '.0f';
    return l;
  }

  getDataForState(state: StateStats): number[] {
    return state.negativeTestsPerDay;
  }
}
