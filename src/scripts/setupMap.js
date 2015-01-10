import 'mapbox.js';

export default function getMonths(year) {
  'use strict';

  var map;

  // Mapbox access token
  L.mapbox.accessToken = 'pk.eyJ1IjoiZmlyZXMiLCJhIjoiRlFmUjBYVSJ9.82br3TK-5l3LGHBfg3Yjnw';
  // Initialise map
  map = L.mapbox.map('map', 'fires.kng35dfj', {
    zoomControl: false
  });
  // Fit to NSW
  map.fitBounds([
    [-37.50505999800001, 140.999474528],
    [-28.157019914000017, 153.65]
  ]);

  return map;
}
