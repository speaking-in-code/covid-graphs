import { Component, OnInit } from '@angular/core';
import { MatChipSelectionChange } from "@angular/material/chips";
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

/** Interface for selection chips */
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
  xstyle: string;
  prefills: Prefill[] = [
    { title: 'Largest Outbreaks', states: this.tracker.largestOutbreaks },
    { title: 'Highest Infection Rates', states: this.tracker.largestInfectionRates },
    { title: 'Fastest Growth', states: this.tracker.fastestGrowth },
    { title: 'Slowest Growth', states: this.tracker.slowestGrowth },
    { title: 'Most Testing', states: this.tracker.mostTesting },
    { title: 'Most Deaths', states: this.tracker.mostDeaths },
  ];

  constructor(
    private tracker: CovidTrackerService,
    private router: Router,
    private prefsObserver: PrefsObserver) {
  }

  ngOnInit(): void {
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
    this.gotoStates(this.selectedStates);
  }

  /**
   * Called when chip clicked.
   */
  onChipChange(prefill: Prefill): void {
    this.selectedStates = Array.from(prefill.states);
    this.gotoStates(this.selectedStates);
  }

  onXStyleChange(): void {
    this.router.navigate([], { queryParamsHandling: 'merge', queryParams: {xstyle: this.xstyle}});
  }

  // this updates the URL, which triggers onChosenStatesChange
  private gotoStates(selected: string[]) {
    this.router.navigate([], { queryParamsHandling: 'merge', queryParams: {id: selected}});
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
    this.xstyle = states.xstyle ? states.xstyle : 'date';
  }
}
