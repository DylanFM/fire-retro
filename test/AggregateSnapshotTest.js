import '6to5/register';

import chai from 'chai';
import sinon from 'sinon';

sinon.assert.expose(chai.assert, { prefix: '' });
var assert = chai.assert;

import Q from 'q';
import moment from 'moment';
import AggregateSnapshot from '../src/scripts/AggregateSnapshot';
import TimeRangeSnapshot from '../src/scripts/TimeRangeSnapshot';
import Colourer from '../src/scripts/Colourer';

describe('AggregateSnapshot', () => {

  var agg,
      colourer = new Colourer,
      jan14    = moment().set({ year: 2014, month: 0 }),
      tr1      = new TimeRangeSnapshot(jan14.startOf('month'), jan14.endOf('month'), colourer),
      feb14    = moment().set({ year: 2014, month: 1 }),
      tr2      = new TimeRangeSnapshot(feb14.startOf('month'), feb14.endOf('month'), colourer),
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
        }]
      };

  // Stub XHR request to fetch data
  // Return a promise resolving to fake geojson
  sinon.stub(tr1, '_fetchData', () => Q.fcall(() => geojson));
  sinon.stub(tr2, '_fetchData', () => Q.fcall(() => geojson));

  before((done) => {
    // Load the data... this seems icky
    tr1.loadData()
      .then(() => {
        tr2.loadData()
          .then(() => {
            // Now we have data... initialise the agg instance for testing
            agg = new AggregateSnapshot([tr1, tr2]);
            done();
          })
          .catch((e) => done(e));
      })
      .catch((e) => done(e));
  });

  describe('#fireTypes', () => {
    it('has combined them', () => {
      assert.propertyVal(agg.fireTypes, 'GRASS FIRE', 2, '2 grass fires in aggregate');
    });
  });

  describe('#layer', () => {
    it('has built a layer group of all snapshot layers', () => {
      assert.lengthOf(agg.layer.getLayers(), 2, '2 layers total');
    });
  });

  describe('#count', () => {
    it('sums all counts', () => {
      assert.equal(agg.count, 2, '2 items total');
    });
  });

});
