
import { Arrays } from './arrays';

describe('Arrays', () => {
  it(`sorts ascending`, () => {
    let a = [2, 1, 3];
    let out = a.sort(Arrays.compareAscending);
    expect(out).toEqual([1, 2, 3]);
  });

  it(`sorts descending`, () => {
    let a = [2, 1, 3];
    let out = a.sort(Arrays.compareDescending);
    expect(out).toEqual([3, 2, 1]);
  });

  it(`sorts empty`, () => {
    let a = [];
    let out = a.sort(Arrays.compareDescending);
    expect(out).toEqual([]);
  });

  it(`last returns undefined for zero length`, () => {
    let a = [];
    expect(Arrays.last(a)).toBeUndefined();
  });

  it(`last returns last for various lengths`, () => {
    let a = ['foo'];
    expect(Arrays.last(a)).toEqual('foo');

    a = ['foo', 'bar'];
    expect(Arrays.last(a)).toEqual('bar');

    a = ['foo', 'bar', null];
    expect(Arrays.last(a)).toBeNull();
  });

  it(`copy handles empty`, () => {
    let a = [];
    let b = [];
    Arrays.copy(a, b);
    a.push(1);
    expect(a).toEqual([1]);
    expect(b).toEqual([]);
  });

  it (`copy handles filled`, () => {
    let a = ['foo', 'bar', 'baz'];
    let b = ['qux'];
    Arrays.copy(a, b);
    expect(b).toEqual(['foo', 'bar', 'baz']);
  });

  it (`copy is shallow`, () => {
    let ref = { key: 'val' };
    let a = [ref];
    let b = [];
    Arrays.copy(a, b);
    expect(b).toEqual([{key: 'val'}]);
    ref.key = 'new value';
    expect(b).toEqual([{key: 'new value'}]);
  });

  it ('smooths linear with step 1', () => {
    let x = [0, 1, 2, 3, 4, 5];
    let rate = Arrays.smoothLinearRate(x, 1);
    expect(rate).toEqual([null, 1, 1, 1, 1, 1]);
  });

  it ('smooths linear with big step', () => {
    let x = [0, 1, 2, 3, 4, 5];
    let rate = Arrays.smoothLinearRate(x, 7);
    expect(rate).toEqual([null, 1, 1, 1, 1, 1]);
  });

  it ('adjusts to increasing rate', () => {
    let x = [0, 1, 2, 4, 6, 10];
    let rate = Arrays.smoothLinearRate(x, 1);
    expect(rate).toEqual([null, 1, 1, 2, 2, 4]);
  });

  it ('adjusts to increasing rate', () => {
    let x = [0, 1, 2, 4, 16];
    let rate = Arrays.smoothLinearRate(x, 4);
    expect(rate).toEqual([null, 1, 1, 4/3, 4]);
  });

  it('calculates exponential growth', () => {
    let x = [0, 0, 1, 4, 16];
    let rate = Arrays.smoothExponentialRate(x, 1);
    expect(rate).toEqual([null, null, null, 3.0, 3.0]);
  });
});
