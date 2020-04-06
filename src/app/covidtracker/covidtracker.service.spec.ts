import { TestBed } from "@angular/core/testing";
import { CovidTrackerService } from "./covidtracker.service";

describe('CovidTrackerService', () => {
  let realData: CovidTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    realData = TestBed.inject(CovidTrackerService);
  });

  it(`should parse without errors`, () => {
    expect(realData).toBeTruthy('Failed to parse real covid tracker data');
  });

  it('should have right CA data', () => {
    let ca = realData.getStats('CA')
    expect(ca.dates[0]).toEqual(new Date(2020, 2, 4));
    expect(ca.dates[1]).toEqual(new Date(2020, 2, 5));
    expect(ca.positives[0]).toEqual(53);
    expect(ca.positives[1]).toEqual(53);
    expect(ca.positives[2]).toEqual(60);
    expect(ca.positives[3]).toEqual(69);
    expect(ca.smoothedGrowthRate[0]).toBeNull();
    expect(ca.smoothedGrowthRate[1]).toEqual(0);
    expect(ca.smoothedGrowthRate[2]).toBeCloseTo(0.06399);
    expect(ca.smoothedGrowthRate[3]).toBeCloseTo(0.09192);
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
    let tracker = new CovidTrackerService({trackerJson: fakeData});
    expect(tracker.fastestGrowth).toEqual(['MN', 'LA', 'WA', 'AK', 'NY']);
  });

  it('selects highest infection rates', () => {
    let tracker = new CovidTrackerService({trackerJson: fakeData});
    expect(tracker.largestInfectionRates).toEqual(['AK', 'LA', 'MN', 'OH', 'WA']);
  });

  it('selects largest outbreak', () => {
    let tracker = new CovidTrackerService({trackerJson: fakeData});
    expect(tracker.largestOutbreaks).toEqual(['OH', 'MN', 'LA', 'WA', 'AK']);
  });

  it('handles too few states', () => {
    let tracker = new CovidTrackerService({trackerJson: [
        {state: 'FL', date: 20200301, positive: 1},
        {state: 'FL', date: 20200302, positive: 10},
        {state: 'FL', date: 20200303, positive: 99},
    ]});
    expect(tracker.largestOutbreaks).toEqual(['FL']);
  });

  it('handles no states', () => {
    let tracker = new CovidTrackerService({trackerJson: [
      ], debugTopK: false});
    expect(tracker.largestOutbreaks).toEqual([]);
  });
});

