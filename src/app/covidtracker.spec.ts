import {CovidTracker} from './covidtracker';

describe('CovidTracker', () => {
  it(`should parse without errors`, () => {
    let realData = CovidTracker.create();
    expect(realData).toBeTruthy('Failed to parse real covid tracker data');
  });

  it('should have right CA data', () => {
    let realData = CovidTracker.create();
    let ca = realData.getStats('CA')
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

  let fakeData = [
    {state: 'CA', date: 20200301, positive: 100},
    {state: 'CA', date: 20200302, positive: 100},
    {state: 'CA', date: 20200303, positive: 100},

    {state: 'NY', date: 20200301, positive: 100},
    {state: 'NY', date: 20200302, positive: 200},
    {state: 'NY', date: 20200303, positive: 200},

    {state: 'AK', date: 20200301, positive: 100},
    {state: 'AK', date: 20200302, positive: 300},
    {state: 'AK', date: 20200303, positive: 300},

    {state: 'WA', date: 20200301, positive: 100},
    {state: 'WA', date: 20200302, positive: 400},
    {state: 'WA', date: 20200303, positive: 400},

    {state: 'LA', date: 20200301, positive: 100},
    {state: 'LA', date: 20200302, positive: 500},
    {state: 'LA', date: 20200303, positive: 500},

    {state: 'MN', date: 20200301, positive: 100},
    {state: 'MN', date: 20200302, positive: 600},
    {state: 'MN', date: 20200303, positive: 600},

    // Low growth rate, large outbreak.
    {state: 'OH', date: 20200301, positive: 700},
    {state: 'OH', date: 20200302, positive: 700},
    {state: 'OH', date: 20200303, positive: 700},

    // High growth rate, small outbreak.
    {state: 'FL', date: 20200301, positive: 1},
    {state: 'FL', date: 20200302, positive: 10},
    {state: 'FL', date: 20200303, positive: 99},
  ];

  it('selects fastest growth rates', () => {
    let tracker = CovidTracker.create({trackerJson: fakeData});
    expect(tracker.fastest_growth).toEqual(['MN', 'LA', 'WA', 'AK', 'NY']);
  });

  it('selects highest infection rates', () => {
    let tracker = CovidTracker.create({trackerJson: fakeData});
    expect(tracker.largest_infection_rates).toEqual(['AK', 'LA', 'MN', 'OH', 'WA']);
  });

  it('selects largest outbreak', () => {
    let tracker = CovidTracker.create({trackerJson: fakeData});
    expect(tracker.largest_outbreaks).toEqual(['OH', 'MN', 'LA', 'WA', 'AK']);
  });

  it('handles too few states', () => {
    let tracker = CovidTracker.create({trackerJson: [
        {state: 'FL', date: 20200301, positive: 1},
        {state: 'FL', date: 20200302, positive: 10},
        {state: 'FL', date: 20200303, positive: 99},
    ]});
    expect(tracker.largest_outbreaks).toEqual(['FL']);
  });

  it('handles no states', () => {
    let tracker = CovidTracker.create({trackerJson: [
      ]});
    expect(tracker.largest_outbreaks).toEqual([]);
  });
});

