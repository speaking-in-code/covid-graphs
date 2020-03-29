import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";

import { CovidTrackerService, StateStats } from "../covidtracker.service";
import { GraphsData } from "./graphs-data";

/** Interface to ng-select widget. */
interface Selection {
  // Logical ID.
  id: string;
  // User visible name of option.
  name: string;
}

interface Chip {
  name: string;
  selected: boolean;
  readonly selection: Set<string>
}

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent {
  data = new GraphsData(this.tracker);
  private selected: StateStats[] = [];

  constructor(private tracker: CovidTrackerService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(this.onQueryParamsChanged.bind(this));
  }

  /**
   * Called when query params in URL are changed.
   *
   * TODO: maybe refactor this into its own service, shared between conmponents?
   */
  private onQueryParamsChanged(params: ParamMap): void {
    this.selected = [];
    params.getAll('id').forEach((id) => {
      const stats = this.tracker.getStats(id);
      if (stats) {
        this.selected.push(stats);
      }
    });
    this.syncGraphs();
  }

  // Synchronize graphs with selected states.
  // This is really slow and triggers chrome violations. Figure out if there is a way to move it off the event
  // handling thread maybe...?
  private syncGraphs(): void {
    this.data.clearGraphs();
    let ids = [];
    for (let selection of this.selected) {
      this.data.drawState(selection);
    }
  }
}
