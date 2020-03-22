import {Component} from '@angular/core';

import {CovidTracker, StateStats} from "../covidtracker";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent {
  tracker = new CovidTracker();

  states_available = [];
  states_selected = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // TODO(beaton): remove x-axis scrolling
  // Fixing the y-axis minor tickmarks would be nice, but is not supported. =(
  // https://github.com/plotly/plotly.js/issues/903
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

  public test_negative_rate = {
    data: [],
    layout: {
      width: 900, height: 600, title: 'Covid19 Tests per New Confirmed Case',
      yaxis: {title: 'Negative Test Rate (smoothed)', dtick: '', range: [0, 1], tickformat: '%'}
    }
  };

  private graphs = [this.infections, this.growth, this.infection_rate, this.test_negative_rate];

  private drawState(data: StateStats) {
    if (data === undefined) {
      console.log(`drawState: undefined`);
      return;
    }
    console.log(`drawing state: ${data.metadata.code}`);
    const code = data.metadata.code;
    this.infections.data.push({
      x: data.dates, y: data.positives, type: 'scatter', mode: 'lines+points', name: code
    });
    this.growth.data.push({
      x: data.dates, y: data.smoothed_growth_rate, type: 'scatter', mode: 'lines+points', name: code
    });
    this.infection_rate.data.push({
      x: data.dates, y: data.positives_per_mil, type: 'scatter', mode: 'lines+points', name: code
    });
    this.test_negative_rate.data.push({
      x: data.dates, y: data.test_negative_rate, type: 'scatter', mode: 'lines+points', name: code
    });
  }

  private last(a: number[]): number {
    return a[a.length-1];
  }

  ngOnInit() {
    let states = Array.from(this.tracker.states.stateMap.keys());
    states.sort();
    for (const state of states) {
      this.states_available.push(this.statsToSelection(
        this.tracker.getStats(state)));
    }
    let selected = this.route.snapshot.queryParamMap.getAll('id');
    if (selected.length === 0) {
      selected.push('WA', 'CA', 'NY');
    }
    for (let id of selected) {
      this.selectState(id);
    }
  }

  // Synchronize graphs with selected states.
  private syncGraphs(): void {
    for (let i of this.graphs) {
      i.data.length = 0;
    }
    let ids = [];
    for (let selection of this.states_selected) {
      this.drawState(this.selectionToStats(selection.id));
    }
  }

  // Synchronize URL with selected states.
  private syncUrl(): void {
    let ids = [];
    for (let selection of this.states_selected) {
      ids.push(selection.id)
    }
    this.gotoStates(ids);
  }

  private selectState(postal_code: string) {
    const stats = this.tracker.getStats(postal_code);
    if (stats === undefined) {
      console.log(`Unknown postal code ${postal_code}`);
      return;
    }
    this.states_selected.push(this.statsToSelection(stats));
    this.drawState(stats);
  }

  private selectionToStats(postal_code: string): StateStats {
    return this.tracker.getStats(postal_code);
  }

  private statsToSelection(state: StateStats): any {
    return {
      id: state.metadata.code,
      name: `${state.metadata.name} [${state.metadata.code}]`
    };
  }

  gotoStates(selected: string[]) {
    if (selected.length === 0){
      selected = ['DC'];
    }
    this.router.navigate(['/graphs'], { queryParams: { id: selected}});

  }

  onStatesChange(): void {
    this.syncGraphs();
    this.syncUrl();
  }
}
