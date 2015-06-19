import 'babel/register';

import chai from 'chai';
import sinon from 'sinon';

sinon.assert.expose(chai.assert, { prefix: '' });
var assert = chai.assert;

import Q from 'q';
import moment from 'moment';
import Config from '../src/scripts/Config';
import TimeRangeSnapshot from '../src/scripts/TimeRangeSnapshot';
import Colourer from '../src/scripts/Colourer';

describe('TimeRangeSnapshot', () => {

  var tr,
      jan14    = moment().set({ year: 2014, month: 0 }),
      st       = jan14.startOf('month'),
      en       = jan14.endOf('month'),
      colourer = new Colourer,
      geojson  = {
        type:      'FeatureCollection',
        features:  [{
          type:      'Feature',
          geometry:  {
            type:         'Point',
            coordinates:  [100.0, 0.0]
          },
          properties: {
            fireType: 'Grass fire'
          }
        }, {
          type:      'Feature',
          geometry:  {
            type:         'Point',
            coordinates:  [100.0, 0.0]
          },
          properties: {
            fireType: 'Grass Fire'
          }
        }]
      };

  before((done) => {
    // Init our test instance
    tr = new TimeRangeSnapshot(st, en, colourer);
    // Stub XHR request to fetch data
    sinon.stub(tr, '_fetchData', () => {
      // Return a promise resolving to fake geojson
      return Q.fcall(() => geojson);
    });
    // Load data before tests run
    tr.loadData()
      .then(() => done())
      .catch((e) => done(e));
  });

  it('is created with a start and end time', () => {
    assert.equal(st, tr.start);
    assert.equal(en, tr.end);
  });

  it('builds a url to fetch data for the time range', () => {
    var stParam = window.encodeURIComponent(st.utc().format()),
        enParam = window.encodeURIComponent(en.utc().format());
    assert.equal(
      Config.endpoint + '?timeStart=' + stParam + '&timeEnd=' + enParam,
      tr._buildUrl(),
      'built url correctly'
    );
  });

  describe('#loadData()', () => {
    it('loads the data using d3.json', () => {
      assert.equal(geojson, tr.data, 'has set geojson as data');
      assert.equal(tr.data.features.length, 2, 'set the count to number of features');
    });
  });
});
