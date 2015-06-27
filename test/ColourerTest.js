import 'babel/register';

import chai from 'chai';
import sinon from 'sinon';

sinon.assert.expose(chai.assert, { prefix: '' });
var assert = chai.assert;

import Colourer from '../src/scripts/Colourer';

describe('Colourer', () => {
  var colourer;

  beforeEach(() => {
    colourer = new Colourer;
  });

  it('returns a colour for a fire type', () => {
    var colour = colourer.getColour('Bush fire');

    assert(colour.r);
    assert(colour.g);
    assert(colour.b);
  });

  it('returns the same colour for the same type', () => {
    var colour = colourer.getColour('Bush fire');

    assert.equal(
      colourer.getColour('Bush fire').toString(),
      colour.toString(),
      'uses the same colour for the same type'
    );
    assert.equal(
      colourer.getColour('BUSH FIRE').toString(),
      colour.toString(),
      'case insensitive'
    );
    assert.notEqual(
      colourer.getColour('Different').toString(),
      colour.toString(),
      'different type has different colour'
    );
  });
});
