import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CovidTrackerService } from "../covidtracker/covidtracker.service";
import { PrefsObserver, ChosenStates } from "../prefs-observer/prefs-observer.service";


/** Interface to ng-select widget. */
interface Selection {
  // Logical ID.
  id: string;
  // User visible name of option.
  title: string;

  bolded?: boolean;
}

interface Prefill {
  title: string;
  states: string[];
}

@Component({
  selector: 'app-graphs-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {
  available: Selection[] = [];
  selectedStates: string[] = [];

  private prefills = new Map<string, Prefill>([
    ['largestOutbreaks', { title: 'Largest Outbreaks', states: this.tracker.largestOutbreaks }],
    ['largestInfectionRates', { title: 'Highest Infection Rates', states: this.tracker.largestInfectionRates }],
    ['fastestGrowth', { title: 'Fastest Growth', states: this.tracker.fastestGrowth }],
    ['mostTesting', { title: 'Most Testing', states: this.tracker.mostTesting }],
    ['mostDeaths', { title: 'Most Deaths', states: this.tracker.mostDeaths }],
  ]);

  constructor(
    private tracker: CovidTrackerService,
    private router: Router,
    private prefsObserver: PrefsObserver) {
  }

  ngOnInit(): void {
    this.prefills.forEach((value, key) => {
      this.available.push({
        id: key,
        title: value.title,
        bolded: true
      });
    });
    Array.from(this.tracker.states.stateMap.keys()).sort().forEach((postalCode) => {
      let state = this.tracker.getStats(postalCode);
      this.available.push({
        id: postalCode,
        title: `${state.metadata.name} [${state.metadata.code}]`
      });
    });
    this.prefsObserver.chosenStates().subscribe((this.onChosenStatesChange.bind(this)));
  }

  /**
   * Called when user updates selection widget.
   */
  onStatesSelectedChange(): void {
    // Remove duplicates
    let ids = new Set<string>();
    this.selectedStates.forEach((id) => {
      let prefill = this.prefills.get(id);
      if (prefill) {
        prefill.states.forEach((postalCode) => {
          ids.add(postalCode);
        });
      } else {
        ids.add(id);
      }
    });
    this.gotoStates(Array.from(ids));
  }

  // this updates the URL, which triggers onChosenStatesChange
  private gotoStates(selected: string[]) {
    this.router.navigate([], { queryParams: {id: selected}});
  }

  /**
   * Called when query params in URL are changed.
   */
  private onChosenStatesChange(states: ChosenStates) {
    let postalCodes = new Set<string>();
    states.states.forEach((state) => {
      postalCodes.add(state.metadata.code);
    });
    // ng-select change detection is subtle, see https://github.com/ng-select/ng-select/blob/master/README.md note on
    // Change Detection.
    this.selectedStates = Array.from(postalCodes);
  }
}
