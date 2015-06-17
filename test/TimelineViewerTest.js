import 'babel/register';

import chai from 'chai';
import sinon from 'sinon';

sinon.assert.expose(chai.assert, { prefix: '' });
var assert = chai.assert;

import moment from 'moment';
import Map from '../src/scripts/Map';
import Colourer from '../src/scripts/Colourer';
import TimeRangeSnapshot from '../src/scripts/TimeRangeSnapshot';
import TimelineViewer from '../src/scripts/TimelineViewer';
import Q from 'q';
import Rx from 'rx';

describe('TimelineViewer', () => {

  var tv, map, snapshots,
      colourer  = new Colourer,
      jan14     = moment().set({ year: 2014, month: 0 }),
      feb14     = moment().set({ year: 2014, month: 1 }),
      tr1       = new TimeRangeSnapshot(jan14.startOf('month'), jan14.endOf('month'), colourer),
      tr2       = new TimeRangeSnapshot(feb14.startOf('month'), feb14.endOf('month'), colourer),
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
    // Babel is making methods on classes not enumerable, which means the Map class isn't able to be stubbed like this
    // Instead make something that mimics a map and then make a stub instance of it instead
    var FakeMap = () => {};
    FakeMap.prototype = { clear: () => {}, render: () => {} };
    // Mock the map
    map = sinon.createStubInstance(FakeMap);
    // Load the data... this seems icky
    tr1.loadData()
      .then(() => {
        tr2.loadData()
          .then(() => {
            snapshots = Rx.Observable.from([tr1, tr2]);
            // Make new viewer with a our map and snapshot observable
            tv = new TimelineViewer(map, snapshots, colourer);
            // Don't actually show layers...
            tv.layerVisibility.points  = false;
            tv.layerVisibility.hexGrid = false;
            done();
          })
          .catch((e) => done(e));
      })
      .catch((e) => done(e));
  });

  it('has snapshots', () => {
    assert.equal(tv.snapshots, snapshots);
  });

  it('has the map', () => {
    assert.equal(map, tv.map);
   });

   // This is a private method, called within the playback code that runs on an interval
   // In order to avoid awkward tests around time, I'm testing this underlying method here
   describe('#_render()', () => {
     it('clears and renders map', () => {
       tv._render(tr1);
       tv._render(tr2);
       assert(map.clear.calledTwice, 'map cleared twice');
       assert(map.render.calledTwice, 'map render added twice');
     });
   });

});
