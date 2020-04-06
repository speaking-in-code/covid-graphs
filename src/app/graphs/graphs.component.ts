import { HostListener, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { StateStats } from "../covidtracker/covidtracker.service";
import { Arrays } from "./arrays";
import { PrefsObserver, ChosenStates } from "../prefs-observer/prefs-observer.service";

/**
 * Parent class for graphs that respond to state selection changes.
 */
export abstract class GraphsComponent implements OnInit, OnDestroy {
  data: any;
  layout: any;

  private subscription: Subscription;
  private chosenStates: ChosenStates;
  private resizeTimer: number = undefined;

  private static readonly kResizeQuiesceMillis = 50;

  /**
   * Reasonable defaults for plotly.
   *
   * Reference: https://plotly.com/javascript/configuration-options/.
   *
   * https://github.com/plotly/plotly.js/blob/master/src/plot_api/plot_config.js#L22-L86
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
      dragmode: false,
      showlegend: true,
      // Docs: https://plotly.com/javascript/reference/#layout-legend-xanchor
      legend: {
        x: 0.05,
        y: 0.95,
        xanchor: 'left',
        yanchor: 'top',
      },
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
    this.prefsObserver.chosenStates().subscribe(this.onChosenStatesChange.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Create the layout to use. Use getBaseLayout as the base. NB: this used to be implemented as subclass access to
  // the layout object. That doesn't work because plotly modifies data and layout during rendering. In order for
  // changes to work consistently and cleanly, we start with a new copy of layout and data for each render.
  abstract createLayout(): any;

  // Return the data to graph for the given state.
  abstract getDataForState(state: StateStats): number[];

  onXStyleChange() {
    this.redrawPlots();
  }

  private onChosenStatesChange(chosenStates: ChosenStates): void {
    this.chosenStates = chosenStates;
    this.redrawPlots();
  }

  // Plotly sometimes gets confused about graph height, typically during screen rotation events. The graph ends
  // up very short. We detect resizes and then force a refresh. Screen resize events typically fire several times
  // in quick succession, so we wait for things to settle down before redrawing.
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.resizeTimer) {
      window.clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = window.setTimeout(() => {
      this.redrawPlots();
      this.resizeTimer = undefined;
    }, GraphsComponent.kResizeQuiesceMillis);
  }

  private redrawPlots(): void {
    this.layout = this.createLayout();
    this.data = [];
    this.chosenStates.states.forEach((stateStats) => {
      let line: any = {type: 'scatter', mode: 'lines+points', name: stateStats.metadata.code};
      if (this.chosenStates.xstyle === 'critical') {
        line.x = stateStats.offsetDays;
        line.y = this.getDataForState(stateStats).slice(stateStats.offsetCount);
      } else {
        line.x = stateStats.dates;
        line.y = this.getDataForState(stateStats);
      }
      this.data.push(line);
    });
    if (this.layout.yaxis.type === 'log') {
      this.logScaleY();
    }
    if (this.chosenStates.xstyle === 'critical') {
      this.layout.xaxis.title = 'Days Since 1 Person Per Million Infected';
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
        if (line.y[i] === null || isNaN(line.y[i])) {
          continue;
        }
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
