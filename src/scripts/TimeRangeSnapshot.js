import Q from 'q';
import d3 from 'd3';
import L from 'leaflet';
import _ from 'lodash';

export default class Map {

  constructor(start, end, colourer) {
    this.start    = start;
    this.end      = end;
    this.endpoint = 'http://10.0.0.26:8000/incidents';
    this.url      = this._buildUrl();
    this.colourer = colourer;
  }

  loadData() {
    return this._fetchData()
      .then((json) => {
        this.data      = json;
        this.count     = json.features.length;
        this.layer     = this._buildLayer();
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
  _buildLayer() {
    // Build GeoJSON layer
    return L.geoJson(this.data, {
      pointToLayer: (feature, latlng) => {
        // Use circle markers instead of normal markers
        var circle = {
              stroke: false,
              radius:       3,
              fillOpacity:  0.5
            },
            type = feature.properties.fireType;

        circle.color = this.colourer.getColour(type).toString();

        return L.circleMarker(latlng, circle);
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
