import { Arrays } from "../arrays";
import {CovidTrackerService, StateStats} from "../covidtracker.service";

export class GraphsData {
  constructor(private tracker: CovidTrackerService) {
  }

  // TODO(beaton): remove x-axis scrolling
  // Fixing the y-axis minor tickmarks would be nice, but is not supported. =(
  // https://github.com/plotly/plotly.js/issues/903
  public infections = {
    data: [],
    layout: {
      width: 900, height: 1000, title: 'Covid19 Infections',
      yaxis: {
        title: 'Infections',
        type: 'log',
      }
    }
  };

  public growth = {
    data: [],
    layout: {
      width: 900, height: 600, title: 'Covid19 Growth Rate (smoothed)',
      yaxis: {
        title: 'Growth Rate (smoothed)',
        tickformat: "%",
        // autorange: true,
      }
    }
  };

  public infectionRate = {
    data: [],
    layout: {
      width: 900, height: 600, title: 'Covid19 Infections per Million People',
      yaxis: {title: 'Infections Per Million People', type: 'log', dtick: '', autorange: true, rangemode: "tozero"}
    }
  };

  public testNegativeRate = {
    data: [],
    layout: {
      width: 900, height: 600, title: 'Covid19 Tests per New Confirmed Case',
      yaxis: {
        title: 'Negative Test Rate (smoothed)',
        dtick: '',
        // range: [0, 1],
        // tickformat: '%'
      }
    }
  };

  private all = [this.infections, this.growth, this.infectionRate, this.testNegativeRate];

  public clearGraphs(): void {
    for (let i of this.all) {
      i.data.length = 0;
    }
  }

  public drawState(data: StateStats): void {
    if (data === undefined) {
      console.log(`drawState: undefined`);
      return;
    }
    const code = data.metadata.code;
    this.infections.data.push({
      x: data.dates, y: data.positives, type: 'scatter', mode: 'lines+points', name: code
    });
    // this.scaleY(this.infections);
    this.growth.data.push({
      x: data.dates, y: data.smoothedGrowthRate, type: 'scatter', mode: 'lines+points', name: code
    });
    this.infectionRate.data.push({
      x: data.dates, y: data.positivesPerMil, type: 'scatter', mode: 'lines+points', name: code
    });
    // this.scaleY(this.infectionRate);
    this.testNegativeRate.data.push({
      x: data.dates, y: data.testNegativeRate, type: 'scatter', mode: 'lines+points', name: code
    });
  }


}
