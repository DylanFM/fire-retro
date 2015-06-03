import 'babel/register';

import chai from 'chai';
import sinon from 'sinon';

sinon.assert.expose(chai.assert, { prefix: '' });
var assert = chai.assert;

import FireTypeComponent from '../src/scripts/components/FireTypeComponent';
import Colourer from '../src/scripts/Colourer';

describe('FireTypeComponent', () => {

  var component, fireTypes;

  beforeEach(() => {
    component = new FireTypeComponent(new Colourer);
    fireTypes = {
      'Grass fire':        100,
      'Hazard reduction':  50,
      'MVA':               2,
      'Fire alarm':        1
    };
  });

  describe('#_getTree', () => {
    var chart;

    beforeEach(() => {
      var container = component._getTree(fireTypes); // Containing div
      chart         = container.children[0];         // Container has 1 child, <svg>
    });

    it('renders fire types given to it', () => {
      assert.lengthOf(chart.children, 4);
    });

  });

});
