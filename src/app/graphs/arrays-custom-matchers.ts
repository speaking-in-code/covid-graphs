// Jasmine custom matchers for numeric arrays.
// See arrays.spec.ts for usage.
import CustomMatcherFactories = jasmine.CustomMatcherFactories;

declare global {
  namespace jasmine {
    interface Matchers<T> {
      toBeArrayCloseTo(expected: any, expectationFailOutput?: any): boolean;
    }
  }
}

export class ArraysCustomMatchers {
  static readonly matchers: CustomMatcherFactories = {
    toBeArrayCloseTo: function (util, customEqualityTesters) {
      return {
        compare: function (actual: number[], expected: number[]) {
          if (actual.length !== expected.length) {
            return {
              pass: false,
              message: `Expected length ${expected.length}, actual ${actual.length}`
            };
          }
          let msgs = [];
          for (let i = 0; i < actual.length; ++i) {
            let wanted = expected[i];
            let got = actual[i];
            if (Math.abs(wanted - got) > 0.01) {
              msgs.push(`Index ${i}, expected ${wanted}, actual ${got}`);
            }
          }
          return {
            pass: msgs.length === 0,
            message: msgs.join('\n')
          };
        }
      }
    }
  };
}
