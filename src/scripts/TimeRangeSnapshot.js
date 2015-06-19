import Q from 'q';
import d3 from 'd3';
import Config from './config';

export default class TimeRangeSnapshot {

  constructor(start, end) {
    this.start = start;
    this.end   = end;
  }

  loadData() {
    return this._fetchData()
      .then((json) => {
        this.data = json;
      })
      .fail(console.error);
  }

  _buildUrl() {
    var st = window.encodeURIComponent(this.start.clone().utc().format()),
        en = window.encodeURIComponent(this.end.clone().utc().format());
    return Config.endpoint + '?timeStart=' + st + '&timeEnd=' + en;
  }

  _fetchData() {
    return Q.Promise((resolve, reject) => {
      d3.json(this._buildUrl(), (err, json) => {
        if (err || !json.features) {
          reject(err);
        } else {
          resolve(json);
        }
      });
    });
  }

}
