import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { CovidTrackerService, StateStats } from "../../covidtracker.service";
import { GraphsData } from "../graphs-data";


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
  selector: 'app-graphs-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {
  private data = new GraphsData(this.tracker);
  states_available: Selection[] = [];
  states_selected: Selection[] = [];

  largest_outbreaks: Chip = {
    name: 'outbreaks',
    selected: false,
    selection: new Set(this.tracker.largest_outbreaks)
  };

  largest_infection_rates: Chip = {
    name: 'infections',
    selected: false,
    selection: new Set(this.tracker.largest_infection_rates)
  };

  fastest_growth: Chip = {
    name: 'growth',
    selected: false,
    selection: new Set(this.tracker.fastest_growth)
  };

  private readonly chips = [this.largest_outbreaks, this.largest_infection_rates, this.fastest_growth];

  constructor(
    private tracker: CovidTrackerService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    let states = Array.from(this.tracker.states.stateMap.keys()).sort();
    states.forEach((state) => {
      this.states_available.push(this.statsToSelection(
        this.tracker.getStats(state)));
    });
    this.route.queryParamMap.subscribe(this.onQueryParamsChanged.bind(this));
  }


  /**
   * Called when a user selects/unselects the chips.
   */
  onStatesChipClick(chip: Chip) {
    if (!chip.selected) {
      // States currently off, flip on.
      let toAdd = new Set(chip.selection);
      this.states_selected.forEach((selection) => {
        toAdd.delete(selection.id);
      });
      toAdd.forEach((remaining) => {
        this.states_selected.push(this.postalCodeToSelection(remaining));
      })
    } else {
      // States currenlty on, flip them off.
      this.states_selected = this.states_selected.filter((selection: Selection) => {
        return !chip.selection.has(selection.id);
      });
    }
    this.onStatesSelectedChange();
  }

  /**
   * Called when user updates selection widget.
   */
  onStatesSelectedChange(): void {
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
    // ng-select change detection is subtle, see https://github.com/ng-select/ng-select/blob/master/README.md note on
    // Change Detection.
    this.states_selected = [];
    params.getAll('id').forEach((id) => {
      const stats = this.tracker.getStats(id);
      if (stats) {
        this.states_selected.push(this.statsToSelection(stats));
      }
    });
    this.syncGraphs();
    this.syncChips();
  }

  // Synchronize graphs with selected states.
  // This is really slow and triggers chrome violations. Figure out if there is a way to move it off the event
  // handling thread maybe...?
  private syncGraphs(): void {
    this.data.clearGraphs();
    let ids = [];
    for (let selection of this.states_selected) {
      this.data.drawState(this.selectionToStats(selection));
    }
  }

  private syncChips(): void {
    this.chips.forEach((chip) => {
      let toMatch = new Set<string>(chip.selection);
      let count = 0;
      this.states_selected.forEach((selection) => {
        toMatch.delete(selection.id)
      });
      chip.selected = toMatch.size === 0;
    });
  }

  private selectionToStats(selection: Selection): StateStats {
    return this.tracker.getStats(selection.id);
  }

  private postalCodeToSelection(postal_code: string): Selection {
    return this.statsToSelection(this.tracker.getStats(postal_code));
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
