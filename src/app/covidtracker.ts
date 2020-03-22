// Parses data from covidtracker.com

import TrackerJson from '../assets/daily.json';

// States data from Table 2. Cumulative Estimates of Resident Population Change for the United States,
// Regions, States, and Puerto Rico and Region and State Rankings: April 1, 2010 to July 1, 2019 (NST-EST2019-02)
// Source: U.S. Census Bureau, Population Division
// Release Date: December 2019
import StatesJson from '../assets/states.json';

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
  readonly dates: Array<Date> = [];

  // Total positives in the state
  readonly positives: Array<number> = [];

  // Total negatives in the state.
  readonly negatives: Array<number> = [];

  // Positives per million people
  readonly positives_per_mil: Array<number> = [];

  // Daily growth rate, average over previous 2 days.
  readonly smoothed_growth_rate: Array<number> = [];

  // What fraction of tests case back negative on a given day?
  readonly test_negative_rate: Array<number> = [];

  constructor(builder: StateStatsBuilder) {
    this.metadata = builder.metadata;
    this.initDates(builder);
    this.initInfectionRate(builder);
    this.initGrowthRate(builder);
    this.initTestNegativeRate();
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
      if (array[i-1] > array[i]) {
        array[i] = array[i-1];
      }
    }
  }

  // Smooth values in the array over the previous prev days.
  private static smooth(a: number[], prev: number): number[] {
    let s = [];
    for (let i=0; i < a.length; ++i) {
      let sum = 0;
      let days = 0;
      for (let j=i-prev; j <= i; ++j) {
        if (j < 0) {
          continue;
        }
        ++days;
        sum += a[j];
      }
      s.push(sum/days);
    }
    return s;
  }

  private initInfectionRate(builder: StateStatsBuilder) {
    for (const positive of this.positives) {
      this.positives_per_mil.push(
         positive/(this.metadata.population/1000000));
    }
  }

  private initGrowthRate(builder: StateStatsBuilder) {
    this.smoothed_growth_rate.push(NaN, NaN);
    for (let i = 2; i <= this.positives.length; ++i) {
      let orig = this.positives[i - 2];
      let now = this.positives[i];
      let increase = NaN;
      if (orig > 0) {
        increase = Math.pow(now / orig, 1 / 2) - 1.0;
      }
      this.smoothed_growth_rate.push(increase);
    }
  }

  private initTestNegativeRate() {
    let prev_positive = 0;
    let prev_negative = 0;
    let negative_rate = [];
    for (let i = 0; i < this.positives.length; ++i) {
      let new_positive = this.positives[i] - prev_positive;
      prev_positive = new_positive;

      let new_negative = this.negatives[i] - prev_negative;
      prev_negative = new_negative;

      this.debugLog(`new_pos=${new_positive} new_neg=${new_negative}`);
      // negative_rate.push(new_negative / (new_positive + new_negative));
      negative_rate.push(new_negative / (new_positive));
    }
    negative_rate = StateStats.smooth(negative_rate, 2);
    for (let r of negative_rate) {
      this.test_negative_rate.push(r);
    }
  }

  private debugLog(str: string) {
    if (this.metadata.code === 'DISABLED') {
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

/**
 * CovidTracker has all of our statistical data.
 */
export class CovidTracker {
  readonly states = new States();
  private stats = new Map<string, StateStats>();
  readonly fastest_growth: Array<string>;

  constructor() {
    let builders = new Map<string, StateStatsBuilder>();
    for (const obj of TrackerJson) {
      const day = new DailyStats(obj);
      let b = builders.get(day.state_code);
      if (b === undefined) {
        const metadata = this.states.stateMap.get(day.state_code);
        if (metadata === undefined) {
          continue;
        }
        b = new StateStatsBuilder(metadata);
        builders.set(day.state_code, b);
      }
      b.addDailyStats(day);
    }
    builders.forEach((b, postal_code) => {
      this.stats.set(postal_code, b.build());
    });
    this.fastest_growth = Array.from(this.stats.keys());
    this.fastest_growth.sort((a, b) => {
      let growth_a = this.lastElement(this.stats.get(a).smoothed_growth_rate);
      let growth_b = this.lastElement(this.stats.get(a).smoothed_growth_rate);
      if (growth_a === undefined || growth_b < growth_a) {
        return 1;
      } else if (growth_b === undefined || growth_a > growth_b) {
        return growth_a;
      }
      return 0;
    });
    this.fastest_growth.length = 5;
  }

  private lastElement(a: number[]) {
    if (a.length === 0) return undefined;
    return a[a.length-1];
  }

  getStats(postal_code: string): StateStats {
    return this.stats.get(postal_code);
  }
}

