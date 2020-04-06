import { Component, OnInit } from '@angular/core';
import { StateStats } from "../covidtracker/covidtracker.service";
import { GraphsComponent } from "../graphs/graphs.component";
import { PrefsObserver } from "../prefs-observer/prefs-observer.service";

@Component({
  selector: 'app-deaths',
  templateUrl: '../graphs/graphs.component.html',
  styleUrls: ['../graphs/graphs.component.css']
})
export class DeathsComponent extends GraphsComponent {
  constructor(prefsObserver: PrefsObserver) {
    super(prefsObserver);
  }

  createLayout(): any {
    return Object.assign(this.getBaseLayout(), {
      yaxis: {
        title: 'Deaths',
        type: 'log',
        dtick: '',
        autorange: true,
        rangemode: 'tozero',
        hoverformat: '.0f',
      }
    });
  }

  getDataForState(state: StateStats): number[] {
    return state.deaths;
  }
}