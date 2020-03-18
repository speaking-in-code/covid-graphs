// Parses data from covidtracker.com

export class State {
  readonly state: string;
  readonly dates: Array<Date> = [];
  readonly positives: Array<number> = [];
  readonly smoothed_growth_rate: Array<number> = [];

  constructor(options: StateOptions) {
    this.state = options.state;
    options.days.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
    if (this.state === 'CA') {
      console.log('After sorting: ' + JSON.stringify(options.days));
    }
    for (const day of options.days) {
      this.dates.push(day.date);
      this.positives.push(day.positive);
    }
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
}

class Day {
  readonly date: Date;
  readonly positive: number;

  constructor(date: Date, positive: number) {
    this.date = date;
    this.positive = positive;
  }
}

class StateOptions {
  state: string;
  days: Array<Day> = [];
}

export class CovidTracker {
  static fromDailyApiData(daily: Array<any>): CovidTracker {
    let optionsMap = new Map<string, StateOptions>();
    for (const obj of daily) {
      const date = CovidTracker.parseDate(obj.date);
      const state = obj.state;
      const positive = obj.positive;
      let options = optionsMap.get(state);
      if (options === undefined) {
        options = new StateOptions();
        options.state = state;
        optionsMap.set(state, options);
      }
      options.days.push(new Day(date, positive));
    }

    let states = new Map<string, State>();
    optionsMap.forEach((options, state, optionsMap) => {
      states.set(state, new State(options));
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

