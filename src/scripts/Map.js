import L from 'leaflet';
import Config from './config';

export default class Map {

  constructor(id) {
    this.id = id;
    // The leaflet map needs to be setup
    this._initMap();
    // Add group to map
    this.layers = L.layerGroup();
    this.layers.addTo(this.map);
  }

  _initMap() {
    var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{mapboxId}/{z}/{x}/{y}.png', {
      mapboxId: Config.mapboxMapId
    });

    // Initialise map
    this.map = L.map(this.id, {
      zoomControl:         false,
      attributionControl:  false,
      layers:              [tiles]
    });
    this.map.fitBounds(Config.mapBounds);
  }

  clear() {
    this.layers.clearLayers();
  }

  render(layers) {
    // Clear first
    this.clear();
    // Then add layers
    for (var layer of layers) {
      this.layers.addLayer(layer);
    }
  }

}
