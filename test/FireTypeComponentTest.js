import '6to5/register';

import chai from 'chai';
import sinon from 'sinon';

sinon.assert.expose(chai.assert, { prefix: '' });
var assert = chai.assert;

import FireTypeComponent from '../src/scripts/components/FireTypeComponent';

describe('FireTypeComponent', () => {

  describe('#_getTree', () => {
    var component, fireTypes;

    beforeEach(() => {
      component = new FireTypeComponent;
      fireTypes = {
        'Grass fire':        100,
        'Hazard reduction':  50,
        'MVA':               2,
        'Fire alarm':        1
      };
    });

    it('takes a representation of fire types', () => {
      var table = component._getTree(fireTypes);
      var tbody = table.children[0];
      var rows  = tbody.children;

      assert.lengthOf(rows, 4, '4 fire types passed in');
    });

  });

});
