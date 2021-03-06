import cloneDeep from 'lodash/cloneDeep';
import flatten from 'lodash/flatten';
import maxBy from 'lodash/maxBy';
import map from 'lodash/map';
import count from 'turf-count';
import featurecollection from 'turf-featurecollection';
import hex from 'turf-hex';
import point from 'turf-point';
import Config from './config';
import {getSequentialScale} from './colourer';

// Return a layer of the hex grid with coloured polygons ready for adding
export default (function () {
  // New hex grid, same bounds as big map, but a different way
  var bounds    = cloneDeep(Config.mapBounds),
      hexBounds = flatten(bounds.map((c) => c.reverse())),
      hexGrid   = hex(hexBounds, 0.15, 'kilometers');

  // The enclosing function is immediately invoked to memoize the hexgrid
  return function (geojson) {
    // Unfortunately the geojson has some features that have MultiPoint geometries
    // TODO fix the API to return only Point geometries
    // Extract the 1st point from the multipoints for each layer to use in the hexbinning
    var pointJson = featurecollection(
          geojson.features.map((f) => {
            var g = f.geometry,
                coords;
            switch (g.type) {
              case 'MultiPoint':
                coords = g.coordinates[0];
                break;
              case 'Point':
                coords = g.coordinates;
                break;
            }
            // There's a chance of bad data, so confirm we have OK point coords
            if (!coords || coords.length != 2) {
              coords = [0,0]; // In place of bad data
            }
            return point(coords);
          }) // map into an array of turf points
        ),
        countedGrid = count(hexGrid, pointJson, 'ptCount'),
        max         = maxBy(map(countedGrid.features, (cell) => cell.properties.ptCount)), // We need the maximum value in this set of data
        scale       = getSequentialScale(0, max);                                        // Get a scale... min is 0
    // Build the layer for mappage
    return L.geoJson(countedGrid, {
      style: (cell) => {
        var c = scale(cell.properties.ptCount); // Work out colour using scale
        return {
          stroke:       cell.properties.ptCount > 0, // Show if there's data
          fill:         cell.properties.ptCount > 0,
          color:        c,
          weight:       1,
          opacity:      0.3,
          fillColor:    c,
          fillOpacity:  0.7,
          clickable:    false
        };
      }
    });
  };
}());
