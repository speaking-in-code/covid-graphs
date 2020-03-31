import { Component, OnInit } from '@angular/core';
import { GraphsComponent } from "../graphs/graphs.component";
import { ChosenStates, PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-test-rate',
  templateUrl: './test-rate.component.html',
  styleUrls: ['./test-rate.component.css']
})
export class TestRateComponent extends GraphsComponent {
  data = [];
  layout = {
    autosize: true,
    height: GraphsComponent.kGraphHeight,
    margin: GraphsComponent.kGraphMargins,
    xaxis: {
      fixedrange: true
    },
    yaxis: {
      title: 'Negative Test Rate (smoothed)',
      tickformat: '%',
      fixedrange: true,
      range: [0, 1],
    }
  };

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
