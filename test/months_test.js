import '6to5/register';

import { assert } from 'chai';

import moment from 'moment';
import getMonths from '../src/scripts/getMonths';

describe('getMonths', function () {
  it('returns an observable of months for a given year', function () {
    var months = getMonths(2014);

    months.toArray().subscribe((arr) => {
      assert.lengthOf(arr, 12, 'there are 12 months');

      for (var month of arr) {
        assert.equal(2014, month.year(), 'all months are in 2014');
        assert(moment.isMoment(month), 'all months are moment objects');
      }

      // Only the months, in order (zero-based)
      assert.equal(0, arr[0].month());
      assert.equal(1, arr[1].month());
      assert.equal(2, arr[2].month());
      assert.equal(3, arr[3].month());
      assert.equal(4, arr[4].month());
      assert.equal(5, arr[5].month());
      assert.equal(6, arr[6].month());
      assert.equal(7, arr[7].month());
      assert.equal(8, arr[8].month());
      assert.equal(9, arr[9].month());
      assert.equal(10, arr[10].month());
      assert.equal(11, arr[11].month());
    });
  });
});
