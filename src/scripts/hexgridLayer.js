import _ from 'lodash';
import featurecollection from 'turf-featurecollection';
import count from 'turf-count';
import point from 'turf-point';

// Return a layer of the hex grid with coloured polygons ready for adding
export default function hexGridLayer(colourer, hexGrid, geojson) {
  // Unfortunately the geojson has features that have MultiPoint geometries
  // TODO fix the API to return Point geometries
  // Extract the 1st point from the multipoints for each layer to use in the hexbinning
  var pointJson = featurecollection(
        geojson.features.map((mp) => point(mp.geometry.coordinates[0])) // map into an array of turf points
      ),
      countedGrid = count(hexGrid, pointJson, 'ptCount'),
      max         = _.max(_.map(countedGrid.features, (cell) => cell.properties.ptCount)), // We need the maximum value in this set of data
      scale       = colourer.getSequentialScale(0, max);                                   // Get a scale... min is 0
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
        fillOpacity:  0.7
      };
    }
  });
}
