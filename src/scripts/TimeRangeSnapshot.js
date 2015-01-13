import Q from 'q';
import d3 from 'd3';
import L from 'leaflet';

export default class Map {

  constructor(start, end) {
    this.start    = start;
    this.end      = end;
    this.endpoint = 'http://10.0.0.24:8000/incidents';
    this.url      = this._buildUrl();
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
        return L.circleMarker(latlng, {
          radius:       5,
          fillOpacity:  0.5
        });
      }
    });
  }

  // Read the data and pull out the fire types with counts
  _extractFireTypes() {
    return this.data.features.reduce((types, incident) => {
      if (!types[incident.properties.fireType]) {
        types[incident.properties.fireType] = 1;
      } else {
        types[incident.properties.fireType]++;
      }
      return types;
    }, {});
  }

}
