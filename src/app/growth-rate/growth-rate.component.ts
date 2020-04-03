import { Component, OnInit } from '@angular/core';
import { GraphsComponent } from "../graphs/graphs.component";
import { ChosenStates, PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-growth-rate',
  templateUrl: '../graphs/graphs.component.html',
  styleUrls: ['../graphs/graphs.component.css']
})
export class GrowthRateComponent extends GraphsComponent {
  data = [];
  layout = Object.assign(this.getBaseLayout(), {
    automargin: true,
    yaxis: {
      title: 'Growth Rate (smoothed)',
      tickformat: '%',
      rangemode: 'tozero',
    }
  });

  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  drawStates(states: ChosenStates) {
    this.data.length = 0;
    states.states.forEach((stateStats) => {
      this.data.push({
        x: stateStats.dates, y: stateStats.smoothedGrowthRate, type: 'scatter', mode: 'lines+points',
        name: stateStats.metadata.code
      });
    });
  }
}
