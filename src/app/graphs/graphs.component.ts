import { OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Arrays } from "./arrays";
import { PrefsObserver, ChosenStates } from "../prefs-observer/prefs-observer.service";

/**
 * Parent class for graphs that respond to state selection changes.
 */
export abstract class GraphsComponent implements OnInit, OnDestroy {
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

  protected constructor(private prefsObserver: PrefsObserver) {}

  ngOnInit(): void {
    this.subscription = this.prefsObserver.chosenStates().subscribe(this.drawStates.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  abstract drawStates(states: ChosenStates): void;

  // Height of graph in pixels. See comments in infections.ts about why this is fixed.
  protected static kGraphHeight = 450;

  protected static kGraphMargins = { t: 20, pad: 0 };

  /**
   * Tweaks the Y axis so it renders well for log-scaled graphs
   * - setting specific ticks that are more readable (1, 2, 5, 10, 20, ...)
   * - replacing 0 points with null, so they don't freak out on the log graph.
   */
  static logScaleY(data, layout): void {
    let max = 0;
    for (let line of data) {
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
    layout.yaxis.tickvals = tickvals;
    layout.yaxis.range = [0, Math.log10(Arrays.last(tickvals))];
  }
}
