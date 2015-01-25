import '6to5/register';

import { assert } from 'chai';

import moment from 'moment';
import getSnapshots from '../src/scripts/getSnapshots';
import TimeRangeSnapshot from '../src/scripts/TimeRangeSnapshot';
import Colourer from '../src/scripts/Colourer';

describe('getSnapshots', () => {
  it('returns an observable of snapshots for months of a given year', () => {
    var months = getSnapshots(2014, new Colourer);

    months.toArray().subscribe((arr) => {
      assert.lengthOf(arr, 12, 'there are 12 months');

      for (var month of arr) {
        assert.equal(2014, month.end.year(), 'all months are in 2014');
        assert.instanceOf(month, TimeRangeSnapshot, 'all months are snapshots');
      }

      // Only the months, in order (zero-based)
      assert.equal(0, arr[0].end.month());
      assert.equal(1, arr[1].end.month());
      assert.equal(2, arr[2].end.month());
      assert.equal(3, arr[3].end.month());
      assert.equal(4, arr[4].end.month());
      assert.equal(5, arr[5].end.month());
      assert.equal(6, arr[6].end.month());
      assert.equal(7, arr[7].end.month());
      assert.equal(8, arr[8].end.month());
      assert.equal(9, arr[9].end.month());
      assert.equal(10, arr[10].end.month());
      assert.equal(11, arr[11].end.month());
    });
  });
});
