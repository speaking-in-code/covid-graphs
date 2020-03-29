import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";

import { CovidTrackerService, StateStats } from "../covidtracker.service";
import { GraphsData } from "./graphs-data";
import { PrefsObserver, ChosenStates } from "./prefs-observer.service";

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent {
  data = new GraphsData(this.tracker);

  constructor(private tracker: CovidTrackerService,
              private selected: PrefsObserver) {
    selected.chosenStates().subscribe(this.onChosenStatesChange.bind(this));
  }

  private onChosenStatesChange(states: ChosenStates) {
    this.data.clearGraphs();
    for (let state of states.states) {
      this.data.drawState(state);
    }
  }
}
