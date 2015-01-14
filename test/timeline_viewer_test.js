import '6to5/register';

import chai from 'chai';
import sinon from 'sinon';

sinon.assert.expose(chai.assert, { prefix: '' });
var assert = chai.assert;

import moment from 'moment';
import Map from '../src/scripts/Map';
import TimeRangeSnapshot from '../src/scripts/TimeRangeSnapshot';
import TimelineViewer from '../src/scripts/TimelineViewer';
import Rx from 'rx';

describe('TimelineViewer', () => {

  var tv, map,
      jan14     = moment().set({ year: 2014, month: 0 }),
      feb14     = moment().set({ year: 2014, month: 1 }),
      tr1       = new TimeRangeSnapshot(jan14.startOf('month'), jan14.endOf('month')),
      tr2       = new TimeRangeSnapshot(feb14.startOf('month'), feb14.endOf('month')),
      snapshots = Rx.Observable.from([tr1, tr2]);

  beforeEach(() => {
    // Mock the map
    map = sinon.createStubInstance(Map);
    // Make new viewer with a our map and snapshot observable
    tv = new TimelineViewer(map, snapshots);
  });

  it('has snapshots', () => {
    assert.equal(tv.snapshots, snapshots);
  });

  it('has the map', () => {
    assert.equal(map, tv.map);
   });

   // This is a private method, called within the playback code that runs on an interval
   // In order to avoid awkward tests around time, I'm testing this underlying method here
   describe('#_updateCurrent()', () => {
     it('has added the 1st layer to the map on first call', () => {
       assert.isUndefined(tv.current, 'does not have a current item on creation');

       tv._updateCurrent(tr1);

       assert(map.addSnapshot.calledOnce, 'map has had layer added once');
       assert.equal(tr1, map.addSnapshot.firstCall.args[0], 'added the 1st snapshot layer');
       assert(map.removeSnapshot.notCalled, 'did not need to remove a layer');
     });

     it('progresses to the given item', () => {
       tv._updateCurrent(tr2);
       assert.equal(tr2, tv.current);
     });

     it('removes existing map layer and adds current for following items', () => {
       tv._updateCurrent(tr1);
       tv._updateCurrent(tr2);
       assert(map.removeSnapshot.calledOnce, 'map snapshot removed once');
       assert.equal(tr1, map.removeSnapshot.firstCall.args[0], 'removed the 1st snapshot layer');
       assert(map.addSnapshot.calledTwice, 'map snapshot added twice');
       assert.equal(tr2, map.addSnapshot.getCalls()[1].args[0], 'added the 2nd snapshot layer');
     });
   });

});
