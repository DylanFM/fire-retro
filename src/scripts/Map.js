import L from 'leaflet';
import hex from 'turf-hex';
import _ from 'lodash';
import Config from './config';

export default class Map {

  constructor(id) {
    this.id          = id;
    this.accessToken = Config.mapboxAccessToken;
    this.mapId       = Config.mapboxMapId;
    this.layers      = L.layerGroup();
    this.bounds      = [
      [-37.50505999800001, 140.999474528],
      [-28.157019914000017, 153.65]
    ];
    // The leaflet map needs to be setup
    this._initMap();
    // Add group to map
    this.layers.addTo(this.map);
    // Setup hexgrid layer
    this._buildHexGrid();
  }

  _initMap() {
    var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{mapboxId}/{z}/{x}/{y}.png', {
      mapboxId: this.mapId
    });

    // Initialise map
    this.map = L.map(this.id, {
      zoomControl:         false,
      attributionControl:  false,
      layers:              [tiles]
    });
    // Fit to NSW
    this.map.fitBounds(this.bounds);
  }

  // Generate the base hex grid layer used later, just build this once
  _buildHexGrid() {
    // New hex grid, same bounds as big map, but a different way
    var hexBounds = _.flatten(this.bounds.map((c) => c.reverse()));
    this.hexGrid  = hex(hexBounds, 0.2, 'kilometers');
  }

  clear() {
    this.layers.clearLayers();
  }

  render(layers) {
    for (var layer of layers) {
      this.layers.addLayer(layer);
    }
  }

}
