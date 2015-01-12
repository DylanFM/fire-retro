import Q from 'q';
import d3 from 'd3';
import L from 'leaflet';

export default class Map {

  constructor(start, end) {
    this.start = start;
    this.end   = end;
    this.url   = this._buildUrl();
  }

  loadData() {
    return this._fetchData()
      .then((json) => {
        this.data  = json;
        this.count = json.features.length;
        this.layer = this._buildLayer();
      })
      .fail(console.error);
  }

  _buildUrl() {
    var st = window.encodeURIComponent(this.start.utc().format()),
        en = window.encodeURIComponent(this.end.utc().format());
    return 'http://localhost:8000/incidents?timeStart=' + st + '&timeEnd=' + en;
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

}
