import _ from 'lodash';

// Read the data and pull out the fire types with counts
export default function extractFireTypes(geojson) {
  return _.reduce(geojson.features, (types, incident) => {
    var key = incident.properties.fireType.toUpperCase();
    if (!types[key]) {
      types[key] = 1;
    } else {
      types[key]++;
    }
    return types;
  }, {});
}
