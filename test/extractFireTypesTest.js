import 'babel/register';

import chai from 'chai';

var assert = chai.assert;

import extractFireTypes from '../src/scripts/extractFireTypes';

describe('extractFireTypes', () => {
  var geojson  = {
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

  it('parses the data to extract fire types and counts', () => {
    assert.propertyVal(extractFireTypes(geojson.features), 'GRASS FIRE', 2, '2 grass fires, case insensitive');
  });
});
