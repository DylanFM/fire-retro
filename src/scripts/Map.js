import L from 'leaflet';
import hex from 'turf-hex';
import count from 'turf-count';
import point from 'turf-point';
import featurecollection from 'turf-featurecollection';
import _ from 'lodash';

export default class Map {

  constructor(id, colourer) {
    this.id          = id;
    this.colourer    = colourer;
    this.accessToken = 'pk.eyJ1IjoiZmlyZXMiLCJhIjoiRlFmUjBYVSJ9.82br3TK-5l3LGHBfg3Yjnw';
    this.mapId       = 'fires.kng35dfj';
    this.addedLayers = L.layerGroup();
    this.bounds      = [
      [-37.50505999800001, 140.999474528],
      [-28.157019914000017, 153.65]
    ];
    // The leaflet map needs to be setup
    this._initMap();
    // Add group to map
    this.addedLayers.addTo(this.map);
    // Setup hexgrid layer
    this._buildHexGrid();
  }

  _initMap() {
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
    this.map.fitBounds(this.bounds);
  }

  // Generate the base hex grid layer used later, just build this once
  _buildHexGrid() {
    // New hex grid, same bounds as big map, but a different way
    var hexBounds = _.flatten(this.bounds.map((c) => c.reverse()));
    this.hexGrid = hex(hexBounds, 0.2);
    // Add a new layerGroup to handle the hexbinnage
    this.hexGroup = L.layerGroup().addTo(this.map);
  }

  clear() {
    this.addedLayers.clearLayers();
    this.hexGroup.clearLayers();
  }

  addSnapshot(snapshot) {
    // Add points layer
    this.addedLayers.addLayer(snapshot.layer);
    // Use hexgrid to setup hex styles
    if (snapshot.data) { // Could be AggregateSnapshot
      this.hexGroup.addLayer(this._pointsToHex(snapshot.data));
    }
  }

  // Return a layer of the hex grid with coloured polygons ready for adding
  _pointsToHex(geojson) {
    // Unfortunately the geojson has features that have MultiPoint geometries
    // TODO fix the API to return Point geometries
    // Extract the 1st point from the multipoints for each layer to use in the hexbinning
    var pointJson = featurecollection(
          geojson.features.map((mp) => point(mp.geometry.coordinates[0])) // map into an array of turf points
        ),
        countedGrid = count(this.hexGrid, pointJson, 'ptCount'),
        max         = _.max(_.map(countedGrid.features, (cell) => cell.properties.ptCount)), // We need the maximum value in this set of data
        scale       = this.colourer.getSequentialScale(0, max);                              // Get a scale... min is 0
    // Build the layer for mappage
    return L.geoJson(countedGrid, {
      style: (cell) => {
        return {
          stroke:       false,
          fillOpacity:  cell.properties.ptCount > 0 ? 0.6 : 0, // Show if there's data
          fillColor:    scale(cell.properties.ptCount)         // Work out colour using scale
        };
      }
    });
  }

}
