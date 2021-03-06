import { Component, OnInit } from '@angular/core';
import { StateStats } from "../covidtracker/covidtracker.service";
import { GraphsComponent } from "../graphs/graphs.component";
import { PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-daily-deaths',
  templateUrl: '../graphs/graphs.component.html',
  styleUrls: ['../graphs/graphs.component.css']
})
export class DailyDeathsComponent extends GraphsComponent {
  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  createLayout(): any {
    let l = this.getBaseLogLayout();
    l.yaxis.title = 'Deaths per Day (smoothed)';
    return l;
  }

  getDataForState(state: StateStats): number[] {
    return state.smoothedDailyDeaths;
  }
}
