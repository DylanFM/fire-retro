import '6to5/register';

import chai from 'chai';
import sinon from 'sinon';

sinon.assert.expose(chai.assert, { prefix: '' });
var assert = chai.assert;

import Q from 'q';
import moment from 'moment';
import TimeRangeSnapshot from '../src/scripts/TimeRangeSnapshot';

describe('TimeRangeSnapshot', function () {

  var tr,
      jan14 = moment().set({ year: 2014, month: 0 }),
      st = jan14.startOf('month'),
      en = jan14.endOf('month'),
      geojson = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [100.0, 0.0]
          }
        }]
      };

  before(function () {
    // Init our test instance
    tr = new TimeRangeSnapshot(st, en);
    // Stub XHR request to fetch data
    sinon.stub(tr, '_fetchData', () => {
      // Return a promise resolving to fake geojson
      return Q.fcall(() => geojson);
    });
  });

  it('is created with a start and end time', function () {
    assert.equal(st, tr.start);
    assert.equal(en, tr.end);
  });

  it('builds a url to fetch data for the time range', function () {
    var stParam = window.encodeURIComponent(st.utc().format()),
        enParam = window.encodeURIComponent(en.utc().format());
    assert.equal(
      'http://localhost:8000/incidents?timeStart=' + stParam + '&timeEnd=' + enParam,
      tr.url,
      'built url correctly'
    );
  });

  it('does not fetch data on initialisation', function () {
    assert.isUndefined(tr.data, 'no data');
    assert.isUndefined(tr.layer, 'no layer');
  });

  describe('#loadData', function () {
    it('loads the data using d3.json', function (done) {
      tr.loadData().then(() => {
        assert.equal(geojson, tr.data, 'has set geojson as data');
        assert.equal(1, tr.count, 'set the count to number of features');
        done();
      });
    });
  });
});
