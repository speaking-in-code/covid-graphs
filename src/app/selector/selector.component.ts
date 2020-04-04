import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CovidTrackerService, StateStats } from "../covidtracker/covidtracker.service";
import { PrefsObserver, ChosenStates } from "../prefs-observer/prefs-observer.service";


/** Interface to ng-select widget. */
interface Selection {
  // Logical ID.
  id: string;
  // User visible name of option.
  name: string;
}

interface Chip {
  label: string;
  selected: boolean;
  readonly selection: Set<string>
}

@Component({
  selector: 'app-graphs-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {
  availableStates: Selection[] = [];
  selectedStates: Selection[] = [];

  chips: Chip[] = [
    {
      label: 'Largest Outbreaks',
      selected: false,
      selection: new Set(this.tracker.largestOutbreaks)
    },
    {
      label: 'Highest Infection Rates',
      selected: false,
      selection: new Set(this.tracker.largestInfectionRates)
    },
    {
      label: 'Fastest Growth',
      selected: false,
      selection: new Set(this.tracker.fastestGrowth)
    },
    {
      label: 'Most Testing',
      selected: false,
      selection: new Set(this.tracker.mostTesting)
    },
    {
      label: 'Most Deaths',
      selected: false,
      selection: new Set(this.tracker.mostDeaths)
    },
  ];

  constructor(
    private tracker: CovidTrackerService,
    private router: Router,
    private prefsObserver: PrefsObserver) {
  }

  ngOnInit(): void {
    let states = Array.from(this.tracker.states.stateMap.keys()).sort();
    states.forEach((state) => {
      this.availableStates.push(this.statsToSelection(
        this.tracker.getStats(state)));
    });
    this.prefsObserver.chosenStates().subscribe((this.onChosenStatesChange.bind(this)));
  }


  /**
   * Called when a user selects/unselects the chips.
   */
  onStatesChipClick(chip: Chip) {
    if (!chip.selected) {
      // States currently off, flip on.
      let toAdd = new Set(chip.selection);
      this.selectedStates.forEach((selection) => {
        toAdd.delete(selection.id);
      });
      toAdd.forEach((remaining) => {
        this.selectedStates.push(this.postalCodeToSelection(remaining));
      })
    } else {
      // States currenlty on, flip them off.
      this.selectedStates = this.selectedStates.filter((selection: Selection) => {
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
    this.selectedStates.forEach((selection) => {
      ids.push(selection.id);
    });
    this.gotoStates(ids);
  }

  // this updates the URL, which triggers onChosenStatesChange
  private gotoStates(selected: string[]) {
    this.router.navigate([], { queryParams: {id: selected}});
  }

  /**
   * Called when query params in URL are changed.
   */
  private onChosenStatesChange(states: ChosenStates) {
    // ng-select change detection is subtle, see https://github.com/ng-select/ng-select/blob/master/README.md note on
    // Change Detection.
    this.selectedStates = [];
    states.states.forEach((state) => this.selectedStates.push(this.statsToSelection(state)));
    this.syncChips();
  }

  private syncChips(): void {
    this.chips.forEach((chip) => {
      let toMatch = new Set<string>(chip.selection);
      let count = 0;
      this.selectedStates.forEach((selection) => {
        toMatch.delete(selection.id)
      });
      chip.selected = toMatch.size === 0;
    });
  }

  private selectionToStats(selection: Selection): StateStats {
    return this.tracker.getStats(selection.id);
  }

  private postalCodeToSelection(postalCode: string): Selection {
    return this.statsToSelection(this.tracker.getStats(postalCode));
  }

  private statsToSelection(state: StateStats): Selection {
    return {
      id: state.metadata.code,
      name: `${state.metadata.name} [${state.metadata.code}]`
    };
  }
}
