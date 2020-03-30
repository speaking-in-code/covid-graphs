import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CovidTrackerService, StateStats } from "./covidtracker.service";

export class ChosenStates {
  readonly states: StateStats[];
}

@Injectable({
  providedIn: 'root'
})
export class PrefsObserver {
  constructor(private tracker: CovidTrackerService, private route: ActivatedRoute) {
    console.log(`PrefsOserver created`);
  }

  chosenStates(): Observable<ChosenStates> {
    return this.route.queryParamMap.pipe(map((params) => {
      return this.toChosenStates(params);
    }));
  }

  private toChosenStates(params: ParamMap): ChosenStates {
    let states = [];
    params.getAll('id').forEach((id) => {
      const stats = this.tracker.getStats(id);
      if (stats) {
        states.push(stats);
      }
    });
    return {
      states: states
    };
  }
}
