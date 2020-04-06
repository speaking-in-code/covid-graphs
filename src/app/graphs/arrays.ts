import { StateStats } from "../covidtracker/covidtracker.service";

/**
 * Utility methods for arrays.
 */
export class Arrays {
  /** comparator for ascending order */
  static compareAscending(a: number, b: number): number {
    if (a === undefined || b === undefined) {
      throw new Error('Undefined value while sorting');
    }
    return a - b;
  }

  /** comparator for descending order */
  static compareDescending(a: number, b: number): number {
    return -Arrays.compareAscending(a, b);
  }

  /** Last element of an array */
  static last<T>(a: T[]): T {
    if (a.length === 0) return undefined;
    return a[a.length - 1];
  }

  /** Make dest a shallow copy of src */
  static copy<T>(src: T[], dest: T[]): void {
    dest.length = 0;
    src.forEach((x) => {
      dest.push(x);
    })
  }

  /** Arithmetic mean over array. win is the size of the window to use, with 1 meaning single step. */
  static smoothLinearRate(a: number[], win: number): number[] {
    return Arrays.smoothWithFunc(a, win, (prevVal, curVal, steps) => {
      return (curVal - prevVal)/steps;
    });
  }

  /** Geometric mean over array, win is the size of the window to use. */
  // TODO: more tests for this approximation, in particular what does 'smoothing' mean for something that has
  // a set of zero data points, followed by actual base for growth...?
  static smoothExponentialRate(a: number[], win: number): number[] {
    return Arrays.smoothWithFunc(a, win, (prevVal, curVal, steps) => {
      if (prevVal === 0) return null;
      return Math.pow(curVal/prevVal, 1/steps) - 1.0;
    });
  }

  private static smoothWithFunc(a: number[], win: number,
                                smoothFn: (prevVal: number, curVal: number, steps: number) => number): number[] {
    if (win < 1) {
      throw new Error(`window must be an integer > 1. Got ${win}`);
    }
    let out = [];
    for (let cur = 0; cur < a.length; ++cur) {
      let prev = Math.max(0, cur-win);
      if (cur === prev) {
        out.push(null);
      } else {
        let curVal = a[cur];
        let prevVal = a[prev];
        let smoothed = smoothFn(prevVal, curVal, (cur - prev));
        out.push(smoothed);
      }
    }
    return out;
  }
}

