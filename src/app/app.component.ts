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
    layout: {width: 900, height: 600, title: 'Covid19 Growth',
      yaxis: { title: 'Infections', type: 'log', dtick: '', autorange: true, rangemode: "tozero"}}
  };

  public growth = {
    data: [],
    layout: {width: 900, height: 600, title: 'Covid19 Growth Rate (smoothed)',
      yaxis: { title: 'Growth Rate (smoothed)', autorange: true}}
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
  }


  ngOnInit() {
    this.tracker = CovidTracker.fromDailyApiData(DailyStats);
    this.addState('CA');
    this.addState('NY');
    this.addState('OH');
    this.addState('WA');
    this.addState('ID');
    this.addState('FL');
  }


  onSelect(event) {

  }
}
