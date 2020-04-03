import { Component, OnInit } from '@angular/core';
import { GraphsComponent } from "../graphs/graphs.component";
import { ChosenStates, PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-test-rate',
  templateUrl: '../graphs/graphs.component.html',
  styleUrls: ['../graphs/graphs.component.css']
})
export class TestRateComponent extends GraphsComponent {
  data = [];
  layout = Object.assign(this.getBaseLayout(), {
    yaxis: {
      title: 'Negative Test Rate (smoothed)',
      tickformat: '%',
      range: [0, 1],
    }
  });

  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  drawStates(states: ChosenStates) {
    this.data.length = 0;
    states.states.forEach((stateStats) => {
      this.data.push({
        x: stateStats.dates, y: stateStats.smoothedNegativeRate, type: 'scatter', mode: 'lines+points',
        name: stateStats.metadata.code
      });
    });
  }
}
