// Parses data from covidtracker.com

export class State {
  // What state? (two-letter postal code)
  readonly state: string;

  // Dates for which we have data, parallel array with others below.
  readonly dates: Array<Date> = [];

  // Total positives in the state
  readonly positives: Array<number> = [];
  // Positives per million people
  readonly positives_per_mil: Array<number> = [];

  // Daily growth rate, average over previous 2 days.
  readonly smoothed_growth_rate: Array<number> = [];

  // How many new cases were confirmed on a given day?
  readonly new_cases: Array<number> = [];

  // How many new tests were performed on a given day?
  readonly new_tests: Array<number> = [];

  // How many tests were run for each new confirmed case?
  readonly tests_per_case: Array<number> = [];

  private options: StateOptions;
  private pop: StatePopulation;

  constructor(options: StateOptions, pop: StatePopulation) {
    this.options = options;
    this.state = options.state;
    this.pop = pop;
    this.initDays();
    this.initPositives();
    this.initGrowthRate();
    this.initNewCasesAndTests();
  }

  private initDays() {
    this.options.daily.sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });
    for (const day of this.options.daily) {
      this.dates.push(day.date);
    }
  }

  private initPositives() {
    for (const day of this.options.daily) {
      this.positives.push(day.positive);
      this.positives_per_mil.push(
        day.positive/(this.pop.population/1000000));
    }
  }

  private initGrowthRate() {
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

  private initNewCasesAndTests() {
    let prev_positives = 0;
    let prev_tests = 0;
    for (const day of this.options.daily) {
      let new_cases = day.positive - prev_positives;
      this.new_cases.push(new_cases);
      prev_positives = day.positive;

      let new_tests = day.tests - prev_tests;
      this.new_tests.push(new_tests);
      prev_tests = day.tests;

      this.tests_per_case.push(new_tests/new_cases);
    }
  }

  private debugLog(str: string) {
    if (this.state !== 'CA') return;
    console.log(str);
  }
}

type DailyData = {
  date: Date;
  positive: number;
  tests: number;
}

class StateOptions {
  state: string;
  daily: Array<DailyData> = [];
}

// States data from Table 2. Cumulative Estimates of Resident Population Change for the United States,
// Regions, States, and Puerto Rico and Region and State Rankings: April 1, 2010 to July 1, 2019 (NST-EST2019-02)
// Source: U.S. Census Bureau, Population Division
// Release Date: December 2019
import StatesJson from '../assets/states.json';

class StatePopulation {
  readonly name: string;
  readonly code: string;
  readonly population: number;

  constructor(data) {
    this.name = data.name;
    this.code = data.code;
    this.population = data.population;
  }
}

class StatePopulations {
  readonly states: Map<string, StatePopulation>;

  constructor() {
    this.states = new Map<string, StatePopulation>();
    for (const data of StatesJson) {
      const s = new StatePopulation(data);
      this.states.set(s.code, s);
    }
  }
}

export class CovidTracker {
  static fromDailyApiData(daily: Array<any>): CovidTracker {
    const populations = new StatePopulations();
    let optionsMap = new Map<string, StateOptions>();
    for (const obj of daily) {
      const date = CovidTracker.parseDate(obj.date);
      const state = obj.state;
      const positive = obj.positive;
      const tests = obj.positive + obj.negative + obj.pending;
      let options = optionsMap.get(state);
      if (options === undefined) {
        options = new StateOptions();
        options.state = state;
        optionsMap.set(state, options);
      }
      let params: DailyData = {
        date: date,
        positive: obj.positive,
        tests: obj.positive + obj.negative + obj.pending
      };

      options.daily.push(params);
    }

    let states = new Map<string, State>();
    optionsMap.forEach((options, state, optionsMap) => {
      const pop = populations.states.get(state);
      if (!pop) {
        return;
      }
      states.set(state, new State(options, pop));
    });
    return new CovidTracker(states);
  }

  private static parseDate(date: number) {
    let format = /(\d{4})(\d{2})(\d{2})/;
    const match = date.toString().match(format);
    if (match.length !== 4) {
      throw new Error('Unexpected date in data: ' + date);
    }
    return new Date(Number(match[1]), Number(match[2])-1, Number(match[3]));
  }

  readonly states: Map<string, State>;

  private constructor(states: Map<string, State>) {
    this.states = states;
  }
}

