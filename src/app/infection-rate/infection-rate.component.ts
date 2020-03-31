import { Component, OnInit } from '@angular/core';
import { GraphsComponent } from "../graphs/graphs.component";
import { ChosenStates, PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-infection-rate',
  templateUrl: './infection-rate.component.html',
  styleUrls: ['./infection-rate.component.css']
})
export class InfectionRateComponent extends GraphsComponent {
  data = [];
  layout = {
    autosize: true,
    height: GraphsComponent.kGraphHeight,
    margin: GraphsComponent.kGraphMargins,
    xaxis: {
      fixedrange: true
    },
    yaxis: {
      title: 'Infections per Million People',
      type: 'log',
      dtick: '',
      autorange: true,
      rangemode: 'tozero',
      fixedrange: true,
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
        x: stateStats.dates, y: stateStats.positivesPerMil, type: 'scatter', mode: 'lines+points',
        name: stateStats.metadata.code
      });
    });
    GraphsComponent.logScaleY(this.data, this.layout);
  }
}
