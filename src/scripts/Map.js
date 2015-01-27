import L from 'leaflet';

export default class Map {

  constructor(id) {
    this.id          = id;
    this.accessToken = 'pk.eyJ1IjoiZmlyZXMiLCJhIjoiRlFmUjBYVSJ9.82br3TK-5l3LGHBfg3Yjnw';
    this.mapId       = 'fires.kng35dfj';
    this.addedLayers = L.layerGroup();
    // The leaflet map needs to be setup
    this.initMap();
    // Add group to map
    this.addedLayers.addTo(this.map);
  }

  initMap() {
    var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{mapboxId}/{z}/{x}/{y}.png', {
      mapboxId: this.mapId
    });

    // L.mapbox.accessToken = this.accessToken;

    // Initialise map
    this.map = L.map(this.id, {
      zoomControl:         false,
      attributionControl:  false,
      layers:              [tiles]
    });
    // Fit to NSW
    this.map.fitBounds([
      [-37.50505999800001, 140.999474528],
      [-28.157019914000017, 153.65]
    ]);
  }

  addSnapshot(snapshot) {
    this.addedLayers.addLayer(snapshot.layer);
  }

  clear() {
    this.addedLayers.clearLayers();
  }

}
