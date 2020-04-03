import { Component } from '@angular/core';
import { GraphsComponent } from "../graphs/graphs.component";
import { ChosenStates, PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-tests',
  templateUrl: '../graphs/graphs.component.html',
  styleUrls: ['../graphs/graphs.component.css']
})
export class TestsComponent extends GraphsComponent {
  data = [];
  layout = {
    autosize: true,
    height: GraphsComponent.kGraphHeight,
    margin: GraphsComponent.kGraphMargins,
    xaxis: {
      fixedrange: true
    },
    yaxis: {
      title: 'Negative Tests Per Day (Smoothed)',
      hoverformat: '.0f',
    }
  };

  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  drawStates(states: ChosenStates) {
    this.data.length = 0;
    states.states.forEach((stateStats) => {
      this.data.push({
        x: stateStats.dates, y: stateStats.negativeTestsPerDay, type: 'scatter', mode: 'lines+points',
        name: stateStats.metadata.code
      });
    });
  }
}
