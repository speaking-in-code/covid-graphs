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
  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  createLayout(): any {
    let l = this.getBaseLayout();
    l.yaxis.title = 'Tests Per Positive (smoothed)';
    l.yaxis.rangemode = 'tozero';
    l.yaxis.hoverformat = '.1f';
    return l;
  }

  getDataForState(state: StateStats): number[] {
    return state.smoothedTestsPerPositive;
  }
}
