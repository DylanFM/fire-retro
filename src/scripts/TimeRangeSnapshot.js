import Q from 'q';
import d3 from 'd3';
import L from 'leaflet';
import _ from 'lodash';
import Config from './config';
import featurecollection from 'turf-featurecollection';
import count from 'turf-count';
import point from 'turf-point';

export default class TimeRangeSnapshot {

  constructor(start, end, colourer) {
    this.start    = start;
    this.end      = end;
    this.endpoint = Config.endpoint;
    this.url      = this._buildUrl();
    this.colourer = colourer;
  }

  loadData() {
    return this._fetchData()
      .then((json) => {
        this.data      = json;
        this.count     = json.features.length;
        this.fireTypes = this._extractFireTypes();
      })
      .fail(console.error);
  }

  _buildUrl() {
    var st = window.encodeURIComponent(this.start.clone().utc().format()),
        en = window.encodeURIComponent(this.end.clone().utc().format());
    return this.endpoint + '?timeStart=' + st + '&timeEnd=' + en;
  }

  _fetchData() {
    return Q.Promise((resolve, reject) => {
      d3.json(this.url, (err, json) => {
        if (err || !json.features) {
          reject(err);
        } else {
          resolve(json);
        }
      });
    });
  }

  // Using data, build a Leaflet GeoJSON layer
  pointsLayer() {
    // Build GeoJSON layer
    return L.geoJson(this.data, {
      pointToLayer: (feature, latlng) => {
        // Use circle markers instead of normal markers
        var circle = {
              stroke:       false,
              radius:       3,
              fillOpacity:  0.5
            },
            type = feature.properties.fireType;

        circle.color = this.colourer.getColour(type).toString();

        return L.circleMarker(latlng, circle);
      }
    });
  }

  // Return a layer of the hex grid with coloured polygons ready for adding
  hexGridLayer(hexGrid) {
    // Unfortunately the geojson has features that have MultiPoint geometries
    // TODO fix the API to return Point geometries
    // Extract the 1st point from the multipoints for each layer to use in the hexbinning
    var pointJson = featurecollection(
          this.data.features.map((mp) => point(mp.geometry.coordinates[0])) // map into an array of turf points
        ),
        countedGrid = count(hexGrid, pointJson, 'ptCount'),
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

  // Read the data and pull out the fire types with counts
  _extractFireTypes() {
    return _.reduce(this.data.features, (types, incident) => {
      var key = incident.properties.fireType.toUpperCase();
      if (!types[key]) {
        types[key] = 1;
      } else {
        types[key]++;
      }
      return types;
    }, {});
  }

}
