import Component from './Component';
import h from 'virtual-dom/h';
import svg from 'virtual-dom/virtual-hyperscript/svg';
import _ from 'lodash';
import d3 from 'd3';

export default class FireTypeComponent extends Component {

  constructor(colourer) {
    super();
    this.colourer = colourer;
    this.width    = '100%';
    this.height   = '100%';
  }

  _getTree(fireTypes) {
    var keys   = _.keys(fireTypes),
        yScale = this._getYScale(fireTypes),
        offset = 0, // I don't really like having this offset used and accumulated in the map
        types  = _.map(this._sortByCount(fireTypes), (type) => {
          var height = yScale(type[1]),
              rect   = svg('rect', {
                width:   '10%',
                height:  '' + height + '%',
                x:       '90%',
                y:       '' + offset + '%',
                fill:    this.colourer.getColour(type[0]).toString()
              }),
              label = svg('text', {
                'text-anchor':        'end',
                'dominant-baseline':  'hanging',
                fill:                 '#ffffee',
                x:                    '85%',
                y:                    '' + (offset + height/2 - 3) + '%'
              }, (height > 12 ? type[0] : ''));
          // Track offset for next item
          offset += height;
          // Return group with text and rectangle
          return svg('g', [rect, label]);
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

  // Sort the fireTypes by number of incidents descending
  _sortByCount(fireTypes) {
    return _.sortBy(
      _.pairs(fireTypes), (type) => type[1]
    ).reverse();
  }
}
