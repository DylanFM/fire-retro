import '6to5/register';

import chai from 'chai';
import sinon from 'sinon';

sinon.assert.expose(chai.assert, { prefix: '' });
var assert = chai.assert;

import moment from 'moment';
import Map from '../src/scripts/Map';
import TimeRangeSnapshot from '../src/scripts/TimeRangeSnapshot';
import TimelineViewer from '../src/scripts/TimelineViewer';

describe('TimelineViewer', () => {

  var tv, map,
      jan14 = moment().set({ year: 2014, month: 0 }),
      feb14 = moment().set({ year: 2014, month: 1 }),
      tr1   = new TimeRangeSnapshot(jan14.startOf('month'), jan14.endOf('month')),
      tr2   = new TimeRangeSnapshot(jan14.startOf('month'), jan14.endOf('month'));

  beforeEach(() => {
    // Mock the map
    map = sinon.createStubInstance(Map);
    // Make new viewer with a single snapshot
    tv = new TimelineViewer(map, [tr1, tr2]);
  });

  it('has snapshots', () => {
    assert.lengthOf(tv.snapshots, 2);
    assert.equal(tv.snapshots[0], tr1);
    assert.equal(tv.snapshots[1], tr2);
  });

  it('has the map', () => {
    assert.equal(map, tv.map);
   });

   it('has set the current snapshot to the first one on init', () => {
     assert.equal(tr1, tv.current);
   });

   it('has added the 1st layer to the map', () => {
     assert(map.addSnapshot.calledOnce, 'map has had layer added once');
     assert.equal(tr1, map.addSnapshot.firstCall.args[0], 'added the 1st snapshot layer');
     assert(map.removeSnapshot.notCalled, 'did not need to remove a layer');
   });

   describe('#next', () => {
     it('progresses to the next item', () => {
       tv.next();
       assert.equal(tr2, tv.current);
     });

     it('stays at the end if finished', () => {
       tv.next();
       tv.next();
       assert.equal(tr2, tv.current);
     });

     it('adds the current layer to the map', () => {
       tv.next();
       assert(map.removeSnapshot.calledOnce, 'map snapshot removed once');
       assert.equal(tr1, map.removeSnapshot.firstCall.args[0], 'removed the 1st snapshot layer');
       assert(map.addSnapshot.calledTwice, 'map snapshot added twice');
       assert.equal(tr2, map.addSnapshot.getCalls()[1].args[0], 'added the 2nd snapshot layer');
     });
   });

});
