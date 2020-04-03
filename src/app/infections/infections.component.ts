import { Component } from '@angular/core';
import { StateStats } from "../covidtracker/covidtracker.service";
import { GraphsComponent } from '../graphs/graphs.component';
import { ChosenStates, PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-graphs-infections',
  templateUrl: '../graphs/graphs.component.html',
  styleUrls: ['../graphs/graphs.component.css']
})
export class InfectionsComponent extends GraphsComponent {
  layout = Object.assign(this.getBaseLayout(), {
    yaxis: {
      title: 'Infections',
      type: 'log',
    }
  });

  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  getDataForState(state: StateStats): number[] {
    return state.positives;
  }
}
