import L from 'leaflet';
import colourer from './colourer';

// Using data, build a Leaflet GeoJSON layer
export default function pointsLayer(geojson) {
  // Build GeoJSON layer
  return L.geoJson(geojson, {
    pointToLayer: (feature, latlng) => {
      // Use circle markers instead of normal markers
      var circle = {
        stroke:       false,
        radius:       3,
        fillOpacity:  0.5,
        clickable:    false
      };
      circle.color = colourer(feature.properties.fireType).toString();

      return L.circleMarker(latlng, circle);
    }
  });
}
