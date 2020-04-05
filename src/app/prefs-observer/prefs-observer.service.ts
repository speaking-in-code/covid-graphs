import { Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CovidTrackerService, StateStats } from "../covidtracker/covidtracker.service";

export class ChosenStates {
  readonly states: StateStats[];
  readonly xstyle: string;
}

@Injectable({
  providedIn: 'root'
})
export class PrefsObserver {
  constructor(private tracker: CovidTrackerService, private route: ActivatedRoute) {
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
    let xstyle = params.get('xstyle');
    if (xstyle === null) {
      xstyle = 'date';
    }
    return {
      states: states,
      xstyle: xstyle
    };
  }
}
