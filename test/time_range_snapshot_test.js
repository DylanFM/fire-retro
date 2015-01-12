import '6to5/register';

import { assert } from 'chai';

import moment from 'moment';
import TimeRangeSnapshot from '../src/scripts/TimeRangeSnapshot';

describe('TimeRangeSnapshot', function () {

  var jan14 = moment().set({ year: 2014, month: 0 }),
      st = jan14.startOf('month'),
      en = jan14.endOf('month');

  it('is created with a start and end time', function () {
    var tr = new TimeRangeSnapshot(st, en);

    assert.equal(st, tr.start);
    assert.equal(en, tr.end);
  });

  it('builds a url to fetch data for the time range', function () {
    var tr = new TimeRangeSnapshot(st, en);

    assert.equal(
      'http://localhost:8000/incidents?timeStart=' + st + '&timeEnd=' + en,
      tr.url,
      'built url correctly'
    );
  });

  it('does not fetch data on initialisation', function () {
    var tr = new TimeRangeSnapshot(st, en);

    assert.isUndefined(tr.data, 'no data');
    assert.isUndefined(tr.layer, 'no layer');
  });
});
