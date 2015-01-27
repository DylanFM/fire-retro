import L from 'leaflet';
import _ from 'lodash';

export default class AggregateSnapshot {

  constructor(snapshots) {
    this.snapshots = snapshots;
    this.fireTypes = this._extractFireTypes();
    this.count     = this._getCount();
    this.layer     = this._buildLayer();
  }

  // Extract all fire types across snapshots
  _extractFireTypes() {
    return _.reduce(this.snapshots, (types, month) => {
      _.keys(month.fireTypes).forEach((k) => {
        if (!types[k]) {
          types[k] = month.fireTypes[k];  // Init with value
        } else {
          types[k] += month.fireTypes[k]; // Add value
        }
      });
      return types;
    }, {});
  }

  _getCount() {
    return _.reduce(this.fireTypes, (total, num) => {
      return total + num;
    }, 0);
  }

  _buildLayer() {
    return L.layerGroup(
      _.compact(_.map(this.snapshots, 'layer'))
    );
  }

}
