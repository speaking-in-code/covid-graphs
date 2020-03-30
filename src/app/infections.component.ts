import { Component } from '@angular/core';
import { GraphsComponent } from './graphs.component';

import { ChosenStates, PrefsObserver } from "./prefs-observer.service";
@Component({
  selector: 'app-graphs-infections',
  templateUrl: './infections.component.html',
  styleUrls: ['./infections.component.css']
})
export class InfectionsComponent extends GraphsComponent {
  data = [];
  layout = {
    title: 'Covid19 Infections',
    // Autosize set to true is a good idea for horizontal, but triggers bugs with vertical sizing. (Graph relayout
    // will alternate between setting svg-container height to a fixed pixel value (which works) and 100% (which
    // causes layout problems.
    // Leaving this set to true because the responsive layout really makes a big difference for the horizontal.
    autosize: true,
    height: GraphsComponent.kGraphHeight,
    xaxis: {
      fixedrange: true
    },
    yaxis: {
      title: 'Infections',
      type: 'log',
      fixedrange: true
    }
  };

  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  drawStates(states: ChosenStates) {
    this.data.length = 0;
    states.states.forEach((stateStats) => {
      this.data.push({
        x: stateStats.dates, y: stateStats.positives, type: 'scatter', mode: 'lines+points',
        name: stateStats.metadata.code
      });
    });
    GraphsComponent.logScaleY(this.data, this.layout);
  }
}
