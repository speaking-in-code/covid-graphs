import { OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { StateStats } from "../covidtracker/covidtracker.service";
import { Arrays } from "./arrays";
import { PrefsObserver, ChosenStates } from "../prefs-observer/prefs-observer.service";

/**
 * Parent class for graphs that respond to state selection changes.
 */
export abstract class GraphsComponent implements OnInit, OnDestroy {
  data = [];
  layout: any = {};

  private subscription: Subscription;

  /**
   * Reasonable defaults for plotly.
   *
   * Reference: https://plotly.com/javascript/configuration-options/.
   */
  readonly config = {
    responsive: true,
    scrollZoom: false,
    displaylogo: false,
    modeBarButtonsToRemove: [
      'zoom2d', 'pan2d', 'autoScale2d', 'resetScale2d', 'hoverClosestCartesian', 'toggleSpikelines',
      'hoverCompareCartesian', 'zoomIn2d', 'zoomOut2d'
    ]
  };

  protected getBaseLayout() {
    return {
      // Autosize set to true is a good idea for horizontal, but triggers bugs with vertical sizing. (Graph relayout
      // will alternate between setting svg-container height to a fixed pixel value (which works) and 100% (which
      // causes layout problems.
      autosize: true,
      height: 450,
      margin: { t: 20, pad: 0 },
      xaxis: {
        fixedrange: true
      },
      yaxis: {
        fixedrange: true
      },
    }
  }

  protected constructor(private prefsObserver: PrefsObserver) {}

  ngOnInit(): void {
    this.subscription = this.prefsObserver.chosenStates().subscribe(this.drawStates.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  abstract getDataForState(state: StateStats): number[];

  drawStates(states: ChosenStates): void {
    this.data.length = 0;
    states.states.forEach((stateStats) => {
      let yvalues = this.getDataForState(stateStats);
      this.data.push({
        x: stateStats.dates, y: yvalues, type: 'scatter', mode: 'lines+points', name: stateStats.metadata.code
      });
    });
    if (this.layout.yaxis.type === 'log') {
      this.logScaleY();
    }
  }

  /**
   * Tweaks the Y axis so it renders well for log-scaled graphs
   * - setting specific ticks that are more readable (1, 2, 5, 10, 20, ...)
   * - replacing 0 points with null, so they don't freak out on the log graph.
   */
  private logScaleY(): void {
    let max = 0;
    for (let line of this.data) {
      for (let i = 0; i < line.y.length; ++i) {
        max = Math.max(max, line.y[i]);
        if (line.y[i] === 0) {
          line.y[i] = null;
        }
      }
    }
    let tickvals = [];
    let multiplier = .1;
    while (tickvals.length === 0 || Arrays.last(tickvals) <= max) {
      tickvals.push(1 * multiplier);
      if (Arrays.last(tickvals) > max) break;
      tickvals.push(2 * multiplier);
      if (Arrays.last(tickvals) > max) break;
      tickvals.push(5 * multiplier);
      multiplier *= 10;
    }
    this.layout.yaxis.tickvals = tickvals;
    this.layout.yaxis.range = [0, Math.log10(Arrays.last(tickvals))];
  }
}
