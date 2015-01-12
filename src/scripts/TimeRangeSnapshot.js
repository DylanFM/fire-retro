import Q from 'q';
import d3 from 'd3';

export default class Map {

  constructor(start, end) {
    this.start = start;
    this.end   = end;
    this.url   = this._buildUrl();
    this.loadData();
  }

  loadData() {
    return this._fetchData()
      .then((json) => {
        this.data = json;
        this.count = this.data.features.length;
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
        if (err) {
          reject(err);
        } else {     // There's an error
          resolve(json);
        }
      });
    });
  }

}
