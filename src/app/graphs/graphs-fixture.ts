// Test fixture for the graphs component.

import { TestModuleMetadata } from "@angular/core/testing";
import { MatCardModule } from "@angular/material/card";
import { PlotlyModule } from "angular-plotly.js";
import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { of } from "rxjs";
import { CovidTrackerRawData, CovidTrackerService } from "../covidtracker/covidtracker.service";
import { PrefsObserver } from "../prefs-observer/prefs-observer.service";
PlotlyModule.plotlyjs = PlotlyJS;

export class GraphsFixture {
  static getModule(): TestModuleMetadata {
    let tracker = new CovidTrackerService(new CovidTrackerRawData());
    let prefsObserver = jasmine.createSpyObj('PrefsObserver', ['chosenStates']);
    prefsObserver.chosenStates.and.returnValue(of({
      states: [tracker.getStats('CA')]
    }));
    let module = {
      providers: [
        {provide: PrefsObserver, useValue: prefsObserver}
      ],
      declarations: [],
      imports: [
        PlotlyModule,
        MatCardModule,
      ]
    };
    return module;
  }
};
