import { Component, OnInit } from '@angular/core';

import DailyStats from '../assets/daily.json';
import {CovidTracker} from "./covidtracker";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'covid-graphs';
  tracker: CovidTracker;

  // TODO: fix yaxis tick marks, doc is here: https://plot.ly/javascript/tick-formatting/.
  public infections = {
    data: [],
    layout: {width: 900, height: 600, title: 'Covid19 Infections',
      yaxis: { title: 'Infections', type: 'log' }}
  };

  public growth = {
    data: [],
    layout: {width: 900, height: 600, title: 'Covid19 Growth Rate (smoothed)',
      yaxis: { title: 'Growth Rate (smoothed)', tickformat: "%", autorange: true}}
  };

  public infection_rate = {
    data: [],
    layout: {width: 900, height: 600, title: 'Covid19 Infections per Million People',
      yaxis: { title: 'Infections Per Million People', type: 'log', dtick: '', autorange: true, rangemode: "tozero"}}
  };

  public tests_per_case = {
    data: [],
    layout: {
      width: 900, height: 600, title: 'Covid19 Tests per New Confirmed Case',
      yaxis: {title: 'Tests Per New Confirmed Case', dtick: '', range: [0, 50]}
    }
  };


  private addState(state: string) {
    let data = this.tracker.states.get(state);
    if (data === undefined) {
      return;
    }
    this.infections.data.push({
      x: data.dates, y: data.positives, type: 'scatter', mode: 'lines+points', name: state
    });
    this.growth.data.push({
      x: data.dates, y: data.smoothed_growth_rate, type: 'scatter', mode: 'lines+points', name: state
    });
    this.infection_rate.data.push({
      x: data.dates, y: data.positives_per_mil, type: 'scatter', mode: 'lines+points', name: state
    });
    this.tests_per_case.data.push({
      x: data.dates, y: data.tests_per_case, type: 'scatter', mode: 'lines+points', name: state
    });
  }

  private last(a: number[]): number {
    return a[a.length-1];
  }


  ngOnInit() {
    this.tracker = CovidTracker.fromDailyApiData(DailyStats);
    let states = Array.from(this.tracker.states.values());
    states.sort((a, b) => {
      return this.last(b.positives_per_mil) - this.last(a.positives_per_mil);
    });
    /*
    for (let i = 0; i < 5; ++i) {
      this.addState(states[i].state);
    }
    */
    this.addState('CA');
    this.addState('NY');
  }


  onSelect(event) {

  }
}
