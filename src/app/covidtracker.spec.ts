import { async } from '@angular/core/testing';
import { CovidTracker } from './covidtracker';
import DailyStats from '../assets/daily.json';

describe('CovidTracker', () => {
  let tracker = CovidTracker.fromDailyApiData(DailyStats);
  it(`should parse without errors`, () => {
    expect(tracker).toBeTruthy('Failed to parse API input');
  });

  it('should have right CA data', () => {
    let ca = tracker.states.get('CA');
    expect(ca.dates[0]).toEqual(new Date(2020, 2, 4));
    expect(ca.dates[1]).toEqual(new Date(2020, 2, 5));
    expect(ca.positives[0]).toEqual(53);
    expect(ca.positives[1]).toEqual(53);
    expect(ca.positives[2]).toEqual(60);
    expect(ca.positives[3]).toEqual(69);
    expect(ca.smoothed_growth_rate[0]).toEqual(NaN);
    expect(ca.smoothed_growth_rate[1]).toEqual(NaN);
    expect(ca.smoothed_growth_rate[2]).toBeCloseTo(0.06399);
    expect(ca.smoothed_growth_rate[3]).toBeCloseTo(0.14100);
  });
});
