import {Component} from '@angular/core';

import {CovidTracker, StateStats} from "../covidtracker";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {GraphsData} from "./graphs-data";

/** Interface to ng-select widget. */
interface Selection {
  // Logical ID.
  id: string;
  // User visible name of option.
  name: string;
}

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent {
  tracker = new CovidTracker();
  data = new GraphsData(this.tracker);

  states_available: Selection[] = [];
  states_selected: Selection[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    let states = Array.from(this.tracker.states.stateMap.keys()).sort();
    states.forEach((state) => {
      this.states_available.push(this.statsToSelection(
        this.tracker.getStats(state)));
    });
    this.route.queryParamMap.subscribe(this.onQueryParamsChanged.bind(this));
  }

  /**
   * Called when user updates selection widget. Not invoked
   */
  onStatesSelectedChange(): void {
    console.log(`onStatesChange invoked: ${JSON.stringify(this.states_selected.join(' '))}`);
    let ids = [];
    this.states_selected.forEach((selection) => {
      ids.push(selection.id);
    });
    // this updates the URL, which triggers onQueryParamsChanged
    this.gotoStates(ids);
  }

  /**
   * Called when query params in URL are changed.
   */
  private onQueryParamsChanged(params: ParamMap): void {
    console.log(`onQueryParamsChanged invoked`);
    // ng-select change detection is subtle, see https://github.com/ng-select/ng-select/blob/master/README.md note on
    // Change Detection.
    this.states_selected = [];
    params.getAll('id').forEach((id) => {
      const stats = this.tracker.getStats(id);
      if (stats) {
        console.log(`adding stats for ${id}`);
        this.states_selected.push(this.statsToSelection(stats));
      }
    });
    this.syncGraphs();
  }

  // Synchronize graphs with selected states.
  private syncGraphs(): void {
    this.data.clearGraphs();
    let ids = [];
    for (let selection of this.states_selected) {
      this.data.drawState(this.selectionToStats(selection));
    }
  }

  private selectionToStats(selection: Selection): StateStats {
    return this.tracker.getStats(selection.id);
  }

  private statsToSelection(state: StateStats): Selection {
    return {
      id: state.metadata.code,
      name: `${state.metadata.name} [${state.metadata.code}]`
    };
  }

  gotoStates(selected: string[]) {
    this.router.navigate(['/graphs'], { queryParams: { id: selected}});
  }
}
