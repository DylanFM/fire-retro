import 'babel/register';

import chai from 'chai';
import sinon from 'sinon';

sinon.assert.expose(chai.assert, { prefix: '' });
var assert = chai.assert;

import colourer from '../src/scripts/colourer';

describe('colourer', () => {

  it('returns a colour for a fire type', () => {
    var colour = colourer('Bush fire');

    assert(colour.r);
    assert(colour.g);
    assert(colour.b);
  });

  it('returns the same colour for the same type', () => {
    var colour = colourer('Bush fire');

    assert.equal(
      colourer('Bush fire').toString(),
      colour.toString(),
      'uses the same colour for the same type'
    );
    assert.equal(
      colourer('BUSH FIRE').toString(),
      colour.toString(),
      'case insensitive'
    );
    assert.notEqual(
      colourer('Different').toString(),
      colour.toString(),
      'different type has different colour'
    );
  });
});
