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
}
