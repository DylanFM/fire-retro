import Component from './Component';
import h from 'virtual-dom/h';
import svg from 'virtual-dom/virtual-hyperscript/svg';
import _ from 'lodash';
import d3 from 'd3';

export default class FireTypeComponent extends Component {

  constructor(colourer) {
    this.colourer = colourer;
    this.width    = '100%';
    this.height   = '100%';
  }

  _getTree(fireTypes) {
    var keys   = _.keys(fireTypes),
        yScale = this._getYScale(fireTypes),
        offset = 0, // I don't really like having this offset used and accumulated in the map
        types  = _.map(fireTypes, (count, type) => {
          var height = yScale(count),
              el     = svg('rect', {
                width:   '100%',
                height:  '' + height + '%',
                x:       0,
                y:       '' + offset + '%',
                fill:    this.colourer.getColour(type).toString()
              });
          // Track offset for next item
          offset += height;
          // Return bar element
          return el;
        });

    return h('.fireTypes',
      svg('svg', {
        className:  'fireTypes',
        width:      this.width,
        height:     this.height,
      }, types)
    );
  }

  _getYScale(fireTypes) {
    // Total number of incidents
    var sum = _.reduce(_.values(fireTypes), (sum, num) => sum + num);
    // Scale to get percentage of total per-type
    return d3.scale.linear()
            .domain([0, sum])
            .range([0, 100]); // Percent
  }
}
