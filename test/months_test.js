import '6to5/register';

import assert from 'assert';

import getMonths from '../src/scripts/getMonths';

describe('getMonths', function () {
  it('returns an array of months for a given year', function () {
    var months = getMonths(2014);

    assert.equal(12, months.length); // 12 months
  })
});
