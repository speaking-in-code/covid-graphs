import { Component, OnInit } from '@angular/core';
import { StateStats } from "../covidtracker/covidtracker.service";
import { GraphsComponent } from "../graphs/graphs.component";
import { ChosenStates, PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-infection-rate',
  templateUrl: '../graphs/graphs.component.html',
  styleUrls: ['../graphs/graphs.component.css']
})
export class InfectionRateComponent extends GraphsComponent {
  layout = Object.assign(this.getBaseLayout(), {
    yaxis: {
      title: 'Infections per Million People',
      type: 'log',
      dtick: '',
      autorange: true,
      rangemode: 'tozero',
      hoverformat: '.0f',
    }
  });

  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  getDataForState(state: StateStats): number[] {
    return state.positivesPerMil;
  }
}
