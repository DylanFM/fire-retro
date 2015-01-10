import '6to5/register';

import assert from 'assert';

import moment from 'moment';
import getMonths from '../src/scripts/getMonths';

describe('getMonths', function () {
  it('returns an array of months for a given year', function () {
    var months = getMonths(2014);

    assert.equal(12, months.length); // 12 months

    for (var month of months) {
      assert.equal(2014, month.year()); // All in 2014
      assert(moment.isMoment(month));   // All are moment objects
    }

    // Only the months, in order (zero-based)
    assert.equal(0, months[0].month());
    assert.equal(1, months[1].month());
    assert.equal(2, months[2].month());
    assert.equal(3, months[3].month());
    assert.equal(4, months[4].month());
    assert.equal(5, months[5].month());
    assert.equal(6, months[6].month());
    assert.equal(7, months[7].month());
    assert.equal(8, months[8].month());
    assert.equal(9, months[9].month());
    assert.equal(10, months[10].month());
    assert.equal(11, months[11].month());
  });
});
