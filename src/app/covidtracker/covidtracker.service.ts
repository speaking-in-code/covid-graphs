// Parses data from covidtracker.com

import { Injectable } from "@angular/core";
import TrackerJson from '../../assets/daily.json';
// States data from Table 2. Cumulative Estimates of Resident Population Change for the United States,
// Regions, States, and Puerto Rico and Region and State Rankings: April 1, 2010 to July 1, 2019 (NST-EST2019-02)
// Source: U.S. Census Bureau, Population Division
// Release Date: December 2019
import StatesJson from '../../assets/states.json';
import { Arrays } from '../graphs/arrays';

/**
 * Metadata about a state from states.json.
 */
export class StateMetadata {
  readonly code: string;
  readonly name: string;
  readonly population: number;

  constructor(obj: any) {
    this.code = obj.code;
    this.name = obj.name;
    this.population = obj.population;
  }
}

/**
 * Parses daily stats objects from covidtracker JSON api
 */
export class DailyStats {
  readonly date: Date;
  readonly positive: number;
  readonly negative: number;
  readonly state_code: string;

  constructor(obj: any) {
    this.date = DailyStats.parseDate(obj.date);
    this.positive = DailyStats.ensureNumber(obj.positive);
    this.negative = DailyStats.ensureNumber(obj.negative);
    this.state_code = obj.state;
  }

  private static ensureNumber(val) {
    return (typeof (val) === 'number' ? val : 0);
  }

  private static parseDate(date: number) {
    let format = /(\d{4})(\d{2})(\d{2})/;
    const match = date.toString().match(format);
    if (match.length !== 4) {
      throw new Error('Unexpected date in data: ' + date);
    }
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
}

/**
 * Builder for StateStats.
 *
 * Usage:
 *   let b = new StateStatsBuilder(stateMetadaa);
 *   b.addDailyStats(day1);
 *   b.addDailyStats(day2);
 *   b.addDailyStats(day3);
 *   let stats = b.build();
 */
export class StateStatsBuilder {
  metadata: StateMetadata;
  daily: Array<DailyStats> = [];

  constructor(metadata: StateMetadata) {
    this.metadata = metadata;
  }

  addDailyStats(stats: DailyStats) {
    this.daily.push(stats);
  }

  build(): StateStats {
    return new StateStats(this);
  }
}

/**
 * Stats for a given state.
 */
export class StateStats {
  // What state?
  readonly metadata: StateMetadata;

  // Dates for which we have data, parallel array with others below.
  readonly dates: Date[] = [];

  // Total positives in the state
  readonly positives: number[] = [];

  // Total negatives in the state.
  readonly negatives: number[] = [];

  // Positives per million people
  readonly positivesPerMil: number[];

  // Daily growth rate.
  readonly smoothedGrowthRate: number[];

  // What fraction of tests case back negative on a given day?
  readonly smoothedNegativeRate: number[] = [];

  // How many negative tests were run each day?
  readonly negativeTestsPerDay: number[] = [];

  // Smooth data over one week.
  private static readonly kSmoothingDays = 7;

  // Minimum number of positives before calculating growth rates.
  private static readonly kMinPositives = 10;

  constructor(builder: StateStatsBuilder) {
    this.metadata = builder.metadata;
    this.initDates(builder);
    this.positivesPerMil = this.initInfectionRate(builder);
    this.smoothedGrowthRate = this.initGrowthRate(builder);
    this.initNegativeTestInfo();
  }

  private initDates(builder: StateStatsBuilder) {
    builder.daily.sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });
    for (const day of builder.daily) {
      this.dates.push(day.date);
      this.positives.push(day.positive);
      this.negatives.push(day.negative);
    }
    StateStats.ensureNonDecreasing(this.positives);
    StateStats.ensureNonDecreasing(this.negatives);
  }

  private static ensureNonDecreasing(array: number[]) {
    for (let i = 1; i < array.length; ++i) {
      if (array[i - 1] > array[i]) {
        array[i] = array[i - 1];
      }
    }
  }

  private initInfectionRate(builder: StateStatsBuilder): number[] {
    let ppm = []
    for (const positive of this.positives) {
      ppm.push(positive / (this.metadata.population / 1000000));
    }
    return ppm;
  }

  private initGrowthRate(builder: StateStatsBuilder): number[] {
    let rate = Arrays.smoothExponentialRate(this.positives, StateStats.kSmoothingDays);
    for (let i = 0; i < rate.length; ++i) {
      if (this.positives[i] < StateStats.kMinPositives) {
        rate[i] = NaN;
      }
    }
    return rate;
  }

  private initNegativeTestInfo() {
    let negativesPerDay = Arrays.smoothLinearRate(this.negatives, StateStats.kSmoothingDays);
    this.debugLog(`negatives: ${this.negatives.join(' ')}`);
    this.debugLog(`negativesPerDay: ${negativesPerDay.join(' ')}`);
    Arrays.copy(negativesPerDay, this.negativeTestsPerDay);
    let positivesPerDay = Arrays.smoothLinearRate(this.positives, StateStats.kSmoothingDays);
    for (let i = 0; i < negativesPerDay.length; ++i) {
      this.smoothedNegativeRate.push(negativesPerDay[i] / (negativesPerDay[i] + positivesPerDay[i]));
    }
  }

  private debugLog(str: string) {
    if (this.metadata.code === 'none') {
      console.log(str);
    }
  }
}

/**
 * Metadata about all states.
 */
export class States {
  /** Keys are postal codes, values are state metdata */
  readonly stateMap = new Map<string, StateMetadata>();

  constructor() {
    for (const data of StatesJson) {
      let metadata = new StateMetadata(data);
      this.stateMap.set(metadata.code, metadata);
    }
  }
}

// Optional interface to use for creating CovidTracker.
@Injectable({
  providedIn: 'root'
})
export class CovidTrackerRawData {
  trackerJson: any = TrackerJson;
  debugTopK? = false;
};

/**
 * CovidTracker has all of our statistical data.
 */
@Injectable({
  providedIn: 'root',
})
export class CovidTrackerService {
  /** All states */
  readonly states = new States();

  /** States with fastest growth rates, top 5. */
  readonly fastestGrowth: string[];

  /** States with biggest outbreaks, top 5. */
  readonly largestOutbreaks: string[];

  /** States with largest infection rates, top 5. */
  readonly largestInfectionRates: string[];

  /** States with the most testing, top 5. */
  readonly mostTesting: string[];

  private stats = new Map<string, StateStats>();
  private debugTopK: boolean;
  private static kSummarySize = 5;

  /** Create a tracker. Default is to use real raw data. */
  constructor(rawData: CovidTrackerRawData) {
    this.debugTopK = rawData.debugTopK;
    let builders = new Map<string, StateStatsBuilder>();
    let unknownStates = new Set<string>();
    for (const obj of rawData.trackerJson) {
      const day = new DailyStats(obj);
      let b = builders.get(day.state_code);
      if (b === undefined) {
        const metadata = this.states.stateMap.get(day.state_code);
        if (metadata === undefined) {
          unknownStates.add(day.state_code);
          continue;
        }
        b = new StateStatsBuilder(metadata);
        builders.set(day.state_code, b);
      }
      b.addDailyStats(day);
    }
    if (unknownStates.size > 0) {
      let warning = Array.from(unknownStates.keys()).sort().join(' ');
      console.log(`CovidTracker: unknown states found: ${warning}`);
    }
    builders.forEach((b, postal_code) => {
      this.stats.set(postal_code, b.build());
    });
    this.fastestGrowth = this.topK('fastest growth',
      (state) => Arrays.last(state.positives) >= 100,
      (state) => state.smoothedGrowthRate);
    this.largestInfectionRates = this.topK('largest infection rates',
      (state) => true,
      (state) => state.positivesPerMil);
    this.largestOutbreaks = this.topK('largest outbreaks',
      (state) => true,
      (state) => state.positives);
    this.mostTesting = this.topK('most testing',
      (state) => true,
      (state) => state.negativeTestsPerDay);
  }

  getStats(postalCode: string): StateStats {
    return this.stats.get(postalCode);
  }

  /**
   * Finds the top 5 states based on the metric array returned by the extraction function.
   *
   * @param label label to use for debug output.
   * @param filterFn receives StateStats, returns true if the state is eligible for inclusion.
   * @param extractFn receives StateStats, returns an array of values for the state.
   */
  private topK(label: string,
               filterFn: (stateStats: StateStats) => boolean,
               extractFn: (stateStats: StateStats) => number[]): string[] {
    let top = [];
    for (let code of this.stats.keys()) {
      if (filterFn(this.stats.get(code))) {
        top.push(code);
      }
    }
    top.sort((a, b) => {
      let stateA = this.stats.get(a);
      let stateB = this.stats.get(b);
      let valA = Arrays.last(extractFn(stateA));
      let valB = Arrays.last(extractFn(stateB));
      return Arrays.compareDescending(valA, valB);
    });
    if (top.length > CovidTrackerService.kSummarySize) {
      top.length = CovidTrackerService.kSummarySize;
    }
    if (this.debugTopK) {
      let debug = [];
      for (let code of top) {
        let state = this.stats.get(code);
        let val = Arrays.last(extractFn(state));
        debug.push(`${code}=${val}`);
      }
      console.log(`${label}: ${debug.join(' ')}`);
    }
    return top;
  }
}
