import Component from './Component';
import h from 'virtual-dom/h';
import svg from 'virtual-dom/virtual-hyperscript/svg';
import _ from 'lodash';
import d3 from 'd3';

export default class FireTypeComponent extends Component {

  constructor(colourer) {
    this.width    = '100%';
    this.height   = '100%';
    this.colourer = colourer;
  }

  _getTree(fireTypes) {
    var sum = _.reduce(_.values(fireTypes), (sum, num) => sum + num);

    var yScale = d3.scale.linear()
                  .domain([0, sum])
                  .range([0, 100]); // Percent

    var keys  = _.keys(fireTypes);

    var offset = 0;
    var types = _.map(fireTypes, (count, type) => {
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
}
