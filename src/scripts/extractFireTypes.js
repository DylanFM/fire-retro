import reduce from 'lodash/reduce';

// Read the data and pull out the fire types with counts
export default function extractFireTypes(features) {
  return reduce(features, (types, incident) => {
    var key = incident.properties.fireType.toUpperCase();
    if (!types[key]) {
      types[key] = 1;
    } else {
      types[key]++;
    }
    return types;
  }, {});
}
