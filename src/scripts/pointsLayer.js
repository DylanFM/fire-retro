import L from 'leaflet';

// Using data, build a Leaflet GeoJSON layer
export default function pointsLayer(colourer, geojson) {
  // Build GeoJSON layer
  return L.geoJson(geojson, {
    pointToLayer: (feature, latlng) => {
      // Use circle markers instead of normal markers
      var circle = {
            stroke:       false,
            radius:       3,
            fillOpacity:  0.5
          },
          type = feature.properties.fireType;

      circle.color = colourer.getColour(type).toString();

      return L.circleMarker(latlng, circle);
    }
  });
}
