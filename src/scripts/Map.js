import 'mapbox.js';

export default class Map {

  constructor(id) {
    this.id = id;
    this.accessToken = 'pk.eyJ1IjoiZmlyZXMiLCJhIjoiRlFmUjBYVSJ9.82br3TK-5l3LGHBfg3Yjnw';
    this.mapId = 'fires.kng35dfj';

    this.initMap();
  }

  initMap() {
    // Mapbox access token
    L.mapbox.accessToken = this.accessToken;
    // Initialise map
    this.map = L.mapbox.map(this.id, this.mapId, {
      zoomControl: false
    });
    // Fit to NSW
    this.map.fitBounds([
      [-37.50505999800001, 140.999474528],
      [-28.157019914000017, 153.65]
    ]);
  }

  addGeoJSON(json) {
    // BUild GeoJSON layer
    var layer = L.geoJson(json, {
      pointToLayer: (feature, latlng) => {
        // Use circle markers instead of normal markers
        return L.circleMarker(latlng, {
          radius:       5,
          fillOpacity:  0.5
        });
      }
    });
    // Add it to the map
    layer.addTo(this.map);

    return layer;
  }

}
