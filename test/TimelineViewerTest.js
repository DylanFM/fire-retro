import '6to5/register';

import chai from 'chai';
import sinon from 'sinon';

sinon.assert.expose(chai.assert, { prefix: '' });
var assert = chai.assert;

import moment from 'moment';
import Map from '../src/scripts/Map';
import Colourer from '../src/scripts/Colourer';
import TimeRangeSnapshot from '../src/scripts/TimeRangeSnapshot';
import TimelineViewer from '../src/scripts/TimelineViewer';
import Rx from 'rx';

describe('TimelineViewer', () => {

  var tv, map,
      colourer  = new Colourer,
      jan14     = moment().set({ year: 2014, month: 0 }),
      feb14     = moment().set({ year: 2014, month: 1 }),
      tr1       = new TimeRangeSnapshot(jan14.startOf('month'), jan14.endOf('month'), colourer),
      tr2       = new TimeRangeSnapshot(feb14.startOf('month'), feb14.endOf('month'), colourer),
      snapshots = Rx.Observable.from([tr1, tr2]);

  beforeEach(() => {
    // Mock the map
    map = sinon.createStubInstance(Map);
    // Make new viewer with a our map and snapshot observable
    tv = new TimelineViewer(map, snapshots, colourer);
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
     it('clears map and adds snapshots provided', () => {
       tv._render(tr1);
       tv._render(tr2);
       assert(map.clear.calledTwice, 'map cleared twice');
       assert(map.addSnapshot.calledTwice, 'map snapshot added twice');
       assert.equal(tr2, map.addSnapshot.getCalls()[1].args[0], 'added the 2nd snapshot layer');
     });
   });

});
